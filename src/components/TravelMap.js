'use client';

import { forwardRef, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { geoMercator, geoPath, geoArea } from 'd3-geo';
import { feature } from 'topojson-client';
import worldTopo from 'world-atlas/countries-50m.json';
import { visitedCountries } from '@/data/travel';
import { ArrowLeft, Plus, Minus, RotateCcw } from 'lucide-react';

const WIDTH = 960;
const HEIGHT = 520;
const TRANSITION_MS = 650;

const allCountries = feature(worldTopo, worldTopo.objects.countries).features;
const visitedMap = new Map(visitedCountries.map((c) => [c.id, c]));

// Base world Mercator, fit to the frame once. Paths/centroids are computed against
// this projection and then animated via a CSS-like transform (scale + translate)
// applied on the rendered SVG group and HTML overlays.
const baseProjection = geoMercator().fitExtent(
  [[10, 10], [WIDTH - 10, HEIGHT - 10]],
  {
    type: 'MultiPoint',
    coordinates: [
      [-170, -58],
      [170, -58],
      [170, 78],
      [-170, 78],
    ],
  },
);
const basePath = geoPath(baseProjection);

// Continent definitions: bounding boxes in lon/lat.
export const CONTINENTS = {
  world: { label: 'World', bounds: null },
  europe: { label: 'Europe', bounds: [[-12, 34], [41, 71]] },
  america: { label: 'America', bounds: [[-168, -56], [-34, 73]] },
  africa: { label: 'Africa', bounds: [[-19, -35], [54, 38]] },
  asia: { label: 'Asia', bounds: [[26, -11], [150, 75]] },
};

// Pre-compute static info about every country feature (path data only; we
// render the SVG but no longer label unvisited countries).
const countryRecords = allCountries.map((f) => ({
  id: f.id ?? f.properties?.name,
  rawId: f.id,
  name: f.properties?.name,
  feature: f,
  d: basePath(f),
}));
const recordById = new Map();
countryRecords.forEach((r) => r.rawId && recordById.set(r.rawId, r));

// For multi-polygon features (France + French Guiana, USA + Alaska, etc.),
// return only the largest polygon so zoom fits just the "mainland".
function mainlandFeature(f) {
  if (!f) return null;
  const g = f.geometry;
  if (!g || g.type !== 'MultiPolygon') return f;
  let bestIdx = 0;
  let bestArea = -Infinity;
  for (let i = 0; i < g.coordinates.length; i++) {
    const area = geoArea({ type: 'Polygon', coordinates: g.coordinates[i] });
    if (area > bestArea) {
      bestArea = area;
      bestIdx = i;
    }
  }
  return {
    type: 'Feature',
    properties: f.properties,
    id: f.id,
    geometry: { type: 'Polygon', coordinates: g.coordinates[bestIdx] },
  };
}

// Given a pixel-space bbox, compute (scale, tx, ty) that zooms-in so that the
// bbox is centered in the frame with the given padding.
function fitTransform(bounds, pad) {
  const [[x0, y0], [x1, y1]] = bounds;
  const bw = Math.max(1, x1 - x0);
  const bh = Math.max(1, y1 - y0);
  const s = Math.min((WIDTH - 2 * pad) / bw, (HEIGHT - 2 * pad) / bh);
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const tx = WIDTH / 2 - cx * s;
  const ty = HEIGHT / 2 - cy * s;
  return { s, tx, ty };
}

function continentPixelBounds(key) {
  const b = CONTINENTS[key]?.bounds;
  if (!b) return null;
  const [[a, c], [d, e]] = b;
  const pts = [
    [a, c],
    [d, c],
    [d, e],
    [a, e],
  ].map((p) => baseProjection(p));
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [
    [Math.min(...xs), Math.min(...ys)],
    [Math.max(...xs), Math.max(...ys)],
  ];
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Tween an { s, tx, ty } state toward target whenever target changes.
// Returns the current (live) value and whether an animation is in progress.
function useZoomTween(target, duration = TRANSITION_MS) {
  const stateRef = useRef(target);
  const animatingRef = useRef(false);
  const rafRef = useRef();
  const [, force] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = { ...stateRef.current };
    const to = target;
    // Skip tween if identical (avoids a pointless frame cycle).
    if (from.s === to.s && from.tx === to.tx && from.ty === to.ty) {
      animatingRef.current = false;
      return undefined;
    }
    const start = performance.now();
    animatingRef.current = true;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const e = easeInOutCubic(t);
      stateRef.current = {
        s: from.s + (to.s - from.s) * e,
        tx: from.tx + (to.tx - from.tx) * e,
        ty: from.ty + (to.ty - from.ty) * e,
      };
      force();
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        animatingRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.s, target.tx, target.ty, duration]);

  return { ...stateRef.current, animating: animatingRef.current };
}

// Approximate label card height in screen pixels (used to attach leader lines
// to the bottom edge of the label instead of its center).
const LABEL_HALF_HEIGHT = 11;

// Auto label-distribution. Given an array of `{ id, pos: [x, y] }` in screen
// coordinates, returns a Map<id, [dx, dy]> of screen-pixel offsets from each
// pin to its label.
//
// Rules (modeled after real tag-on-a-pin behavior):
//   - default: label sits directly above the pin at `defaultDy` (no leader).
//   - when neighbors are within `clusterRadius`, the label is fanned along
//     the top hemisphere (`vy` is clamped negative so labels never dip
//     below the pin) in the direction of the pin inside its cluster.
//   - horizontal direction comes from the pin's x-offset within the cluster
//     (leftmost city → label leans left, rightmost → leans right).
//   - vertical direction is always "up", with a small extra lift for pins
//     that sit in the upper half of the cluster so stacked pins stagger.
//   - spread stays small so leader lines are short; it grows mildly with
//     cluster size so dense regions (Europe at world zoom, NE-Brazil at
//     country zoom) still resolve.
//   - identical coords fall back to a deterministic per-id angle (still in
//     the top half) so stacked pins separate.
function computeLabelOffsets(
  points,
  {
    clusterRadius = 55,
    defaultDy = -20,
    baseSpread = 22,
    spreadPerNeighbor = 3.5,
    maxSpread = 80,
  } = {},
) {
  const result = new Map();
  const r2 = clusterRadius * clusterRadius;
  for (const p of points) {
    const neighbors = [];
    for (const q of points) {
      if (q === p) continue;
      const dx = p.pos[0] - q.pos[0];
      const dy = p.pos[1] - q.pos[1];
      if (dx * dx + dy * dy < r2) neighbors.push(q);
    }
    if (neighbors.length === 0) {
      result.set(p.id, [0, defaultDy]);
      continue;
    }
    const cluster = [p, ...neighbors];
    let cx = 0;
    let cy = 0;
    for (const c of cluster) {
      cx += c.pos[0];
      cy += c.pos[1];
    }
    cx /= cluster.length;
    cy /= cluster.length;
    let vx = p.pos[0] - cx;
    let vy = p.pos[1] - cy;
    const len = Math.hypot(vx, vy);
    if (len < 1e-4) {
      // Pin exactly at cluster center — pick a deterministic angle in the
      // top half (between ~-135° and ~-45° from horizontal) based on id so
      // stacked pins still separate predictably.
      const seed = String(p.id)
        .split('')
        .reduce((s, ch) => s + ch.charCodeAt(0), 0);
      const a = ((seed * 137) % 180) * (Math.PI / 180); // 0..π
      vx = Math.cos(a + Math.PI); // maps to [-1..1]
      vy = -Math.abs(Math.sin(a + Math.PI)) - 0.2; // forced upward
    } else {
      vx /= len;
      vy /= len;
      // Clamp label into the top hemisphere: labels never drop below the pin.
      // Pins in the lower half of the cluster still get pushed up so they
      // look like real pins hanging from above.
      vy = Math.min(vy, -0.3);
    }
    const n = Math.hypot(vx, vy) || 1;
    vx /= n;
    vy /= n;
    const rawSpread = baseSpread + neighbors.length * spreadPerNeighbor;
    const spread = Math.min(rawSpread, maxSpread);
    result.set(p.id, [vx * spread, vy * spread]);
  }
  return result;
}

// Pre-compute each visited country's pin position in base-projection pixels.
// The label offset is derived automatically at render time via
// `computeLabelOffsets` (see below). Pin defaults to the first listed city's
// coords and can be overridden via `pinCoords` in travel data.
const visitedMarkers = visitedCountries
  .map((c) => {
    const pinCoords = c.pinCoords || c.cities?.[0]?.coords;
    if (!pinCoords) return null;
    const pinBase = baseProjection(pinCoords);
    if (!pinBase || !Number.isFinite(pinBase[0])) return null;
    return { country: c, pinBase };
  })
  .filter(Boolean);

const TravelMap = forwardRef(function TravelMap(
  { selectedId, onSelect, continent = 'world', onContinentChange, hoveredId = null },
  ref,
) {
  const selectedRecord = selectedId ? recordById.get(selectedId) : null;
  const selectedFeature = selectedRecord?.feature || null;

  // User-controlled zoom multiplier on top of the view's natural zoom. Resets
  // whenever the active view changes (continent switch or country select/back).
  const [zoomMult, setZoomMult] = useState(1);
  useEffect(() => {
    setZoomMult(1);
  }, [selectedId, continent]);

  // User-controlled pan offset (view-space pixels). Applied on top of the
  // animated transform. Reset when the active view changes so every new
  // target is centered cleanly.
  const [pan, setPan] = useState({ x: 0, y: 0 });
  useEffect(() => {
    setPan({ x: 0, y: 0 });
  }, [selectedId, continent, zoomMult]);

  // Drag-pan handling. We track the pointer in refs so updates don't cause
  // re-renders until the pan itself changes.
  const dragRef = useRef(null);
  const innerRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handlePointerDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    const targetEl = e.target;
    // Don't start a drag when the user clicks an interactive element (country
    // path, pin label button, controls, etc.).
    if (targetEl && targetEl.closest && targetEl.closest('button, a, [role="tab"]')) {
      return;
    }
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      basePan: pan,
      pointerId: e.pointerId,
    };
    setDragging(true);
    innerRef.current?.setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!dragRef.current) return;
    const { startX, startY, basePan } = dragRef.current;
    // Pointer moves in screen pixels, but the SVG viewBox maps 1 unit to
    // roughly `innerWidth / WIDTH` pixels. Scale the delta back into viewBox
    // units so the map appears to follow the cursor 1:1.
    const rect = innerRef.current?.getBoundingClientRect();
    const scale = rect ? WIDTH / rect.width : 1;
    const dx = (e.clientX - startX) * scale;
    const dy = (e.clientY - startY) * scale;
    setPan({ x: basePan.x + dx, y: basePan.y + dy });
  }

  function handlePointerUp(e) {
    if (!dragRef.current) return;
    const id = dragRef.current.pointerId;
    dragRef.current = null;
    setDragging(false);
    try {
      innerRef.current?.releasePointerCapture?.(id);
    } catch (_) {
      // no-op: pointer already released
    }
  }

  // Compute the target transform for the active view.
  const target = useMemo(() => {
    let base;
    if (selectedFeature) {
      const bounds = basePath.bounds(mainlandFeature(selectedFeature));
      base = fitTransform(bounds, 80);
    } else if (continent !== 'world') {
      const b = continentPixelBounds(continent);
      base = b ? fitTransform(b, 50) : { s: 1, tx: 0, ty: 0 };
    } else {
      base = { s: 1, tx: 0, ty: 0 };
    }
    if (zoomMult === 1) return base;
    // Zoom in/out around the center of the frame so the focus stays put.
    const cx = WIDTH / 2;
    const cy = HEIGHT / 2;
    return {
      s: base.s * zoomMult,
      tx: cx - (cx - base.tx) * zoomMult,
      ty: cy - (cy - base.ty) * zoomMult,
    };
  }, [selectedId, continent, selectedFeature, zoomMult]);

  const canZoomIn = zoomMult < 4;
  const canZoomOut = zoomMult > 0.5;

  const { s, tx: baseTx, ty: baseTy, animating } = useZoomTween(target);

  // Effective translate includes the user's pan offset. Pan is not included
  // in the tween target on purpose — the tween handles continent/country
  // transitions while pan gives the user fine control on top.
  const tx = baseTx + pan.x;
  const ty = baseTy + pan.y;

  // Helper: base pixel (cx, cy) → current view pixel (vx, vy).
  function toView(cx, cy) {
    return [cx * s + tx, cy * s + ty];
  }

  function inFrame(vx, vy, margin = 40) {
    return vx >= -margin && vx <= WIDTH + margin && vy >= -margin && vy <= HEIGHT + margin;
  }

  function toPercent(vx, vy) {
    return { left: `${(vx / WIDTH) * 100}%`, top: `${(vy / HEIGHT) * 100}%` };
  }

  // Auto-distributed label offsets. For each pin, default is a fixed height
  // above it; if neighbors are within `CLUSTER_RADIUS` screen px, the pin's
  // label is pushed radially outward from the local cluster's centroid (with a
  // small upward bias and extra spread for denser clusters). Recomputed when
  // the target view changes so the geometry always matches what's on screen.
  const countryLabelOffsets = useMemo(() => {
    if (selectedId) return new Map();
    const points = visitedMarkers
      .map(({ country, pinBase }) => ({
        id: country.id,
        pos: [
          pinBase[0] * target.s + target.tx,
          pinBase[1] * target.s + target.ty,
        ],
      }))
      .filter(
        ({ pos }) =>
          pos[0] > -120 && pos[0] < WIDTH + 120 &&
          pos[1] > -120 && pos[1] < HEIGHT + 120,
      );
    return computeLabelOffsets(points);
  }, [selectedId, target]);

  const cityLabelOffsets = useMemo(() => {
    if (!selectedId) return new Map();
    const selected = visitedMap.get(selectedId);
    if (!selected?.cities) return new Map();
    const points = selected.cities
      .map((city) => {
        const proj = baseProjection(city.coords);
        if (!proj) return null;
        return {
          id: city.name,
          pos: [proj[0] * target.s + target.tx, proj[1] * target.s + target.ty],
        };
      })
      .filter(Boolean);
    return computeLabelOffsets(points);
  }, [selectedId, target]);

  return (
    <div
      ref={ref}
      className="relative w-full min-h-[420px] lg:min-h-0 lg:h-full rounded-2xl border border-gray-200 bg-gradient-to-br from-sky-50 to-white overflow-hidden shadow-sm scroll-mt-8 flex items-center justify-center"
    >
      {/* Aspect-locked inner box so SVG content and HTML label overlays share
          the same coordinate system regardless of the outer container's
          aspect. */}
      <div
        ref={innerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full max-w-full max-h-full"
        style={{
          aspectRatio: `${WIDTH} / ${HEIGHT}`,
          cursor: dragging ? 'grabbing' : 'grab',
          touchAction: 'none',
        }}
      >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute inset-0 h-full w-full select-none"
        aria-label={
          selectedRecord
            ? `Map of ${visitedMap.get(selectedId).name}`
            : `World map (${CONTINENTS[continent]?.label || 'World'} view)`
        }
      >
        {/* Ocean backdrop (fades out slightly on zoom) */}
        <rect
          x="0"
          y="0"
          width={WIDTH}
          height={HEIGHT}
          fill="#eff6ff"
          style={{
            opacity: selectedId || continent !== 'world' ? 0.5 : 1,
            transition: 'opacity 400ms ease',
          }}
        />

        {/* Zoomed map content */}
        <g transform={`translate(${tx} ${ty}) scale(${s})`}>
          {/* Background countries (dimmed + blurred while a country is selected) */}
          <g
            style={{
              filter: selectedId ? 'blur(1.5px)' : 'none',
              opacity: selectedId ? 0.3 : 1,
              transition: 'filter 400ms ease, opacity 400ms ease',
            }}
          >
            {countryRecords.map((r, i) => {
              if (selectedId && r.rawId === selectedId) return null;
              const isVisited = r.rawId && visitedMap.has(r.rawId);
              const isHovered = hoveredId && r.rawId === hoveredId && !selectedId;
              let fill = '#e5e7eb';
              if (isVisited) fill = isHovered ? '#2563eb' : '#60a5fa';
              return (
                <path
                  // Some world-atlas features share an id (or have none); pair
                  // with the array index to guarantee uniqueness.
                  key={`${r.id ?? 'unknown'}-${i}`}
                  d={r.d}
                  fill={fill}
                  stroke={isHovered ? '#1d4ed8' : '#ffffff'}
                  strokeWidth={isHovered ? 1.3 : 0.6}
                  vectorEffect="non-scaling-stroke"
                  onClick={() => {
                    if (!selectedId && isVisited) onSelect?.(r.rawId);
                  }}
                  style={{
                    cursor: !selectedId && isVisited ? 'pointer' : 'default',
                    transition: 'fill 200ms ease, stroke 200ms ease',
                  }}
                >
                  {isVisited && <title>{visitedMap.get(r.rawId).name}</title>}
                </path>
              );
            })}
          </g>

          {/* Selected country on top, crisp */}
          {selectedRecord && (
            <path
              d={selectedRecord.d}
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth={1.2}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </g>

        {/* Leader lines + pins at real country locations (world/continent views) */}
        {!selectedId &&
          visitedMarkers.map(({ country, pinBase }) => {
            const [px, py] = toView(pinBase[0], pinBase[1]);
            if (
              px < -40 || px > WIDTH + 40 ||
              py < -40 || py > HEIGHT + 40
            ) {
              return null;
            }
            const offset = countryLabelOffsets.get(country.id) || [0, -22];
            const [lx, ly] = [px + offset[0], py + offset[1]];
            const lineEndY = ly + LABEL_HALF_HEIGHT;
            const isHovered = hoveredId === country.id;
            const hasLine = Math.hypot(offset[0], offset[1]) > 4;
            return (
              <g key={`pin-${country.id}`}>
                {hasLine && (
                  <line
                    x1={px}
                    y1={py}
                    x2={lx}
                    y2={lineEndY}
                    stroke={isHovered ? '#1d4ed8' : '#6b7280'}
                    strokeWidth={isHovered ? 1.4 : 1}
                    strokeLinecap="round"
                    style={{ transition: 'stroke 200ms ease' }}
                  />
                )}
                <circle
                  cx={px}
                  cy={py}
                  r={isHovered ? 4 : 3}
                  fill={isHovered ? '#1d4ed8' : '#ef4444'}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  style={{ transition: 'r 200ms ease, fill 200ms ease' }}
                />
              </g>
            );
          })}

        {/* City pins + leader lines (auto-distributed labels, screen-space) */}
        {selectedId &&
          visitedMap.get(selectedId)?.cities.map((city) => {
            const projected = baseProjection(city.coords);
            if (!projected) return null;
            const [px, py] = toView(projected[0], projected[1]);
            const offset = cityLabelOffsets.get(city.name) || [0, -22];
            const [lx, ly] = [px + offset[0], py + offset[1]];
            const lineEndY = ly + LABEL_HALF_HEIGHT;
            return (
              <g
                key={city.name}
                style={{
                  opacity: animating ? 0 : 1,
                  transition: 'opacity 300ms ease 150ms',
                }}
              >
                <line
                  x1={px}
                  y1={py}
                  x2={lx}
                  y2={lineEndY}
                  stroke="#6b7280"
                  strokeWidth={1}
                  strokeLinecap="round"
                />
                <circle cx={px} cy={py} r={9} fill="#ef4444" fillOpacity={0.18} />
                <circle cx={px} cy={py} r={3.5} fill="#ef4444" stroke="#ffffff" strokeWidth={1.5} />
              </g>
            );
          })}
      </svg>

      {/* Continent tabs (hidden in country view) */}
      {!selectedId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div
            role="tablist"
            aria-label="Map region"
            className="inline-flex items-center gap-0.5 p-1 bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow-sm"
          >
            {Object.entries(CONTINENTS).map(([key, value]) => {
              const active = continent === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onContinentChange?.(key)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    active ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {value.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* World / continent view: country labels anchored above their pins */}
      {!selectedId &&
        visitedMarkers.map(({ country, pinBase }) => {
          const [px, py] = toView(pinBase[0], pinBase[1]);
          const offset = countryLabelOffsets.get(country.id) || [0, -22];
          const [lx, ly] = [px + offset[0], py + offset[1]];
          if (!inFrame(lx, ly)) return null;
          const isHovered = hoveredId === country.id;
          return (
            <button
              key={country.id}
              type="button"
              onClick={() => onSelect?.(country.id)}
              aria-label={`Open ${country.name}`}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10 hover:z-20 ${
                isHovered ? 'z-20' : ''
              }`}
              style={toPercent(lx, ly)}
            >
              <span
                className={`inline-block px-2 py-1 text-[10px] sm:text-[11px] font-semibold bg-white text-gray-900 border rounded-md shadow-md ring-1 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:shadow-lg whitespace-nowrap ${
                  isHovered
                    ? 'border-blue-400 ring-blue-200 -translate-y-0.5'
                    : 'border-gray-200 ring-black/5'
                }`}
              >
                {country.sticker?.image ? (
                  <img
                    src={country.sticker.image}
                    alt={country.sticker.label || country.name}
                    className="h-10 w-[60px] object-cover rounded-sm"
                  />
                ) : (
                  country.sticker?.label || country.name
                )}
              </span>
            </button>
          );
        })}

      {/* Country view: city labels (anchored above the pin, matches country labels) */}
      {selectedId &&
        visitedMap.get(selectedId)?.cities.map((city) => {
          const projected = baseProjection(city.coords);
          if (!projected) return null;
          const [px, py] = toView(projected[0], projected[1]);
          const offset = cityLabelOffsets.get(city.name) || [0, -22];
          const [lx, ly] = [px + offset[0], py + offset[1]];
          if (!inFrame(lx, ly)) return null;
          return (
            <div
              key={city.name}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 z-10"
              style={{
                ...toPercent(lx, ly),
                opacity: animating ? 0 : 1,
                transition: 'opacity 300ms ease 150ms',
              }}
            >
              <span className="inline-block px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-gray-900 bg-white border border-gray-200 rounded-md shadow-md whitespace-nowrap">
                {city.name}
              </span>
            </div>
          );
        })}

      {/* Back button in country view */}
      {selectedId && (
        <button
          type="button"
          onClick={() => onSelect?.(null)}
          className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-white/90 backdrop-blur border border-gray-200 rounded-md shadow-sm hover:bg-white hover:shadow-md transition-all z-20"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back
        </button>
      )}

      {/* Country name label in country view */}
      {selectedRecord && (
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur border border-gray-200 rounded-md shadow-sm z-20">
          <span className="text-sm font-semibold text-gray-900">
            {visitedMap.get(selectedId).name}
          </span>
        </div>
      )}

      {/* Zoom controls (bottom-right). Always visible; resets with view. */}
      <div
        className="absolute bottom-4 right-4 z-20 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white/95 shadow-sm backdrop-blur"
        aria-label="Zoom controls"
      >
        <button
          type="button"
          onClick={() => setZoomMult((z) => Math.min(4, +(z * 1.25).toFixed(3)))}
          disabled={!canZoomIn}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          <Plus size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setZoomMult((z) => Math.max(0.5, +(z / 1.25).toFixed(3)))}
          disabled={!canZoomOut}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center border-t border-gray-200 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          <Minus size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoomMult(1);
            setPan({ x: 0, y: 0 });
          }}
          disabled={zoomMult === 1 && pan.x === 0 && pan.y === 0}
          aria-label="Reset view"
          title="Reset view"
          className="flex h-8 w-8 items-center justify-center border-t border-gray-200 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          <RotateCcw size={13} aria-hidden="true" />
        </button>
      </div>
      </div>
    </div>
  );
});

export default TravelMap;

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

// Pre-compute static info about every country feature (path, centroid, area).
const countryRecords = allCountries.map((f) => ({
  id: f.id ?? f.properties?.name,
  rawId: f.id,
  name: f.properties?.name,
  feature: f,
  d: basePath(f),
  centroid: basePath.centroid(f),
  area: basePath.area(f),
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

// Pre-compute pin (base pixel) and label-offset (base pixel) for each visited
// country. Pin defaults to the first listed city's coords.
const visitedMarkers = visitedCountries
  .map((c) => {
    const pinCoords = c.pinCoords || c.cities?.[0]?.coords;
    if (!pinCoords) return null;
    const pinBase = baseProjection(pinCoords);
    if (!pinBase || !Number.isFinite(pinBase[0])) return null;
    const offset = c.labelOffset || [0, -14];
    const labelBase = [pinBase[0] + offset[0], pinBase[1] + offset[1]];
    return { country: c, pinBase, labelBase };
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

  const { s, tx, ty, animating } = useZoomTween(target);

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

  // Visible unvisited-country labels for continent views. Hidden during zoom
  // animation and in the world view (too cluttered).
  const labels = useMemo(() => {
    if (selectedId || continent === 'world') return [];
    return countryRecords.flatMap((r) => {
      if (!r.rawId || visitedMap.has(r.rawId)) return [];
      if (!Number.isFinite(r.centroid[0])) return [];
      const [vx, vy] = toView(r.centroid[0], r.centroid[1]);
      if (!inFrame(vx, vy, 0)) return [];
      // Only label countries that take up a meaningful area at the target zoom.
      if (r.area * target.s * target.s < 600) return [];
      return [{ id: r.id, name: r.name, vx, vy }];
    });
    // Recompute when view changes (zoom values affect visibility).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continent, selectedId, s, tx, ty]);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[16/9] rounded-2xl border border-gray-200 bg-gradient-to-br from-sky-50 to-white overflow-hidden shadow-sm scroll-mt-8"
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="absolute inset-0 h-full w-full"
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
            {countryRecords.map((r) => {
              if (selectedId && r.rawId === selectedId) return null;
              const isVisited = r.rawId && visitedMap.has(r.rawId);
              const isHovered = hoveredId && r.rawId === hoveredId && !selectedId;
              let fill = '#e5e7eb';
              if (isVisited) fill = isHovered ? '#2563eb' : '#60a5fa';
              return (
                <path
                  key={r.id}
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
          visitedMarkers.map(({ country, pinBase, labelBase }) => {
            const [px, py] = toView(pinBase[0], pinBase[1]);
            const [lx, ly] = toView(labelBase[0], labelBase[1]);
            if (
              px < -40 || px > WIDTH + 40 ||
              py < -40 || py > HEIGHT + 40
            ) {
              return null;
            }
            // Line attaches to the bottom edge of the label so it visually hangs
            // from the pin like a real tag.
            const lineEndY = ly + LABEL_HALF_HEIGHT;
            const isHovered = hoveredId === country.id;
            const hasLine = !(pinBase[0] === labelBase[0] && pinBase[1] === labelBase[1]);
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

        {/* City pins + leader lines (constant screen-space offset for labels) */}
        {selectedId &&
          visitedMap.get(selectedId)?.cities.map((city) => {
            const projected = baseProjection(city.coords);
            if (!projected) return null;
            const [px, py] = toView(projected[0], projected[1]);
            const offset = city.labelOffset || [0, -20];
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

      {/* Continent labels (HTML overlay so text stays a constant size) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: animating ? 0 : 1,
          transition: 'opacity 300ms ease 200ms',
        }}
      >
        {labels.map((l) => (
          <span
            key={`lbl-${l.id}`}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-[10px] font-medium text-gray-500 whitespace-nowrap"
            style={toPercent(l.vx, l.vy)}
          >
            {l.name}
          </span>
        ))}
      </div>

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
        visitedMarkers.map(({ country, labelBase }) => {
          const [lx, ly] = toView(labelBase[0], labelBase[1]);
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
          const offset = city.labelOffset || [0, -20];
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
          onClick={() => setZoomMult(1)}
          disabled={zoomMult === 1}
          aria-label="Reset zoom"
          title="Reset zoom"
          className="flex h-8 w-8 items-center justify-center border-t border-gray-200 text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
        >
          <RotateCcw size={13} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

export default TravelMap;

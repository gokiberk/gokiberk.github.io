'use client';

import { SideMenu } from '@/components/SideMenu';
import TravelMap from '@/components/TravelMap';
import { visitedCountries } from '@/data/travel';
import { useEffect, useRef, useState } from 'react';

const FLAGS = {
  TR: '🇹🇷', US: '🇺🇸', BR: '🇧🇷', DE: '🇩🇪', FR: '🇫🇷',
  IT: '🇮🇹', VA: '🇻🇦', MC: '🇲🇨', ES: '🇪🇸', NL: '🇳🇱',
  BE: '🇧🇪', HU: '🇭🇺', AT: '🇦🇹', CZ: '🇨🇿', GR: '🇬🇷',
  CH: '🇨🇭', RS: '🇷🇸', EG: '🇪🇬', DK: '🇩🇰', PY: '🇵🇾',
  AR: '🇦🇷',
};

export default function TravelClient() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [continent, setContinent] = useState('world');
  const [hoveredId, setHoveredId] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1300);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleContinentChange(key) {
    setSelectedId(null);
    setContinent(key);
  }

  function handleSelect(id) {
    setSelectedId(id);
    if (id && mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const totalCities = visitedCountries.reduce((sum, c) => sum + c.cities.length, 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideMenu
        isMobile={isMobile}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main
        className={`flex-1 pt-16 md:pt-0 transition-all duration-300 ${
          !isMobile ? (isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64') : ''
        }`}
      >
        <div className="px-4 md:px-8 lg:px-10 py-6 md:py-10 max-w-[1400px] mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Travel
            </h1>
            <p className="text-gray-600">
              {visitedCountries.length} countries, {totalCities} cities. Pick a region, hover a place, or click a pin.
            </p>
          </header>

          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] items-start">
            <TravelMap
              ref={mapRef}
              selectedId={selectedId}
              onSelect={handleSelect}
              continent={continent}
              onContinentChange={handleContinentChange}
              hoveredId={hoveredId}
            />

            <aside aria-label="Places" className="order-last lg:order-first">
              <div className="lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto bg-blue-50/60 border border-blue-100 rounded-xl p-5">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-700 mb-3">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-blue-600"
                  />
                  Places
                </p>
                <ul
                  className="space-y-1.5"
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {visitedCountries.map((country) => {
                    const active = selectedId === country.id;
                    const hovered = hoveredId === country.id;
                    return (
                      <li key={country.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(country.id)}
                          onMouseEnter={() => setHoveredId(country.id)}
                          onFocus={() => setHoveredId(country.id)}
                          onBlur={() => setHoveredId(null)}
                          aria-pressed={active}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                            active
                              ? 'bg-blue-600 text-white'
                              : hovered
                                ? 'bg-blue-100 text-blue-900'
                                : 'text-gray-700 hover:bg-blue-100/70 hover:text-blue-900'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 leading-tight">
                            <span className="text-sm font-semibold truncate">
                              <span aria-hidden="true">{FLAGS[country.code] || ''}</span>{' '}
                              {country.name}
                            </span>
                            <span
                              className={`shrink-0 text-[11px] tabular-nums ${
                                active ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {country.cities.length}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

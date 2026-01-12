
import React, { useEffect, useRef, useState } from 'react';
import { Property } from '../types';
// Fix: Import RotateCcw from lucide-react as it is used in the UI component
import { RotateCcw } from 'lucide-react';

interface Props {
  properties: Property[];
}

const MapView: React.FC<Props> = ({ properties }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const clusterGroup = useRef<any>(null);
  const drawnItems = useRef<any>(null);
  const [activeAreaFilter, setActiveAreaFilter] = useState(false);

  const formatPriceShort = (price: number) => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)} م`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)} ألف`;
    return price.toString();
  };

  // Helper: Ray Casting Algorithm for Point-in-Polygon
  const isPointInPolygon = (latlng: any, poly: any) => {
    const lat = latlng.lat;
    const lng = latlng.lng;
    const vs = poly.getLatLngs()[0];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].lat, yi = vs[i].lng;
      const xj = vs[j].lat, yj = vs[j].lng;
      const intersect = ((yi > lng) !== (yj > lng)) &&
        (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  useEffect(() => {
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainer.current) return;

      const L = await import('https://esm.sh/leaflet@1.9.4');
      await import('https://esm.sh/leaflet.markercluster@1.5.3');
      await import('https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js');

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapContainer.current, {
          center: [24.7136, 46.6753],
          zoom: 6,
          zoomControl: false,
          scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; CARTO'
        }).addTo(mapInstance.current);

        L.control.zoom({ position: 'topright' }).addTo(mapInstance.current);

        drawnItems.current = new L.FeatureGroup();
        mapInstance.current.addLayer(drawnItems.current);

        const drawControl = new (L as any).Control.Draw({
          edit: {
            featureGroup: drawnItems.current,
            remove: true
          },
          draw: {
            polygon: {
              allowIntersection: false,
              showArea: true,
              shapeOptions: { color: '#10b981', fillOpacity: 0.1 }
            },
            circle: { shapeOptions: { color: '#10b981', fillOpacity: 0.1 } },
            rectangle: { shapeOptions: { color: '#10b981', fillOpacity: 0.1 } },
            marker: false,
            polyline: false,
            circlemarker: false
          }
        });
        
        mapInstance.current.addControl(drawControl);

        mapInstance.current.on((L as any).Draw.Event.CREATED, (e: any) => {
          drawnItems.current.clearLayers();
          drawnItems.current.addLayer(e.layer);
          setActiveAreaFilter(true);
          updateVisibleMarkers();
        });

        mapInstance.current.on((L as any).Draw.Event.DELETED, () => {
          setActiveAreaFilter(false);
          updateVisibleMarkers();
        });

        mapInstance.current.on((L as any).Draw.Event.EDITED, () => {
           updateVisibleMarkers();
        });
      }

      if (!clusterGroup.current) {
        clusterGroup.current = (L as any).markerClusterGroup({
          maxClusterRadius: 40,
          spiderfyOnMaxZoom: true,
          disableClusteringAtZoom: 16
        });
        mapInstance.current.addLayer(clusterGroup.current);
      }

      const updateVisibleMarkers = () => {
        const L_obj = (window as any).L;
        if (!L_obj) return;
        
        clusterGroup.current.clearLayers();
        const bounds: any[] = [];
        
        properties.forEach(p => {
          const pt = L_obj.latLng(p.lat, p.lng);
          let isInside = true;

          if (drawnItems.current.getLayers().length > 0) {
            isInside = false;
            drawnItems.current.eachLayer((layer: any) => {
              if (layer instanceof L_obj.Polygon) {
                // Precision check using Ray Casting for Polygon/Rectangle
                if (isPointInPolygon(pt, layer)) isInside = true;
              } else if (layer instanceof L_obj.Circle) {
                const dist = layer.getLatLng().distanceTo(pt);
                if (dist <= layer.getRadius()) isInside = true;
              }
            });
          }

          if (isInside) {
            const marker = L_obj.marker([p.lat, p.lng], {
              icon: L_obj.divIcon({
                className: 'custom-price-marker',
                html: `<div class="price-tag">${formatPriceShort(p.price)}</div>`,
                iconSize: [50, 24],
                iconAnchor: [25, 12]
              })
            });

            marker.bindPopup(`
              <div dir="rtl" class="overflow-hidden bg-[#0f172a] text-white">
                <div class="h-28 bg-cover bg-center" style="background-image: url('https://picsum.photos/seed/${p.id}/300/200')"></div>
                <div class="p-4">
                  <h4 class="font-black text-sm mb-1">${p.type} - ${p.district}</h4>
                  <div class="flex justify-between items-center bg-slate-800/50 p-2 rounded-xl">
                    <span class="text-emerald-400 font-black text-xs">${new Intl.NumberFormat('ar-SA').format(p.price)} ريال</span>
                  </div>
                </div>
              </div>
            `, { maxWidth: 220 });

            clusterGroup.current.addLayer(marker);
            bounds.push([p.lat, p.lng]);
          }
        });

        if (bounds.length > 0 && !activeAreaFilter) {
          mapInstance.current.fitBounds(bounds, { padding: [80, 80], maxZoom: 14 });
        }
      };

      updateVisibleMarkers();
    };

    initMap();
  }, [properties]);

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainer} className="w-full h-full z-0 outline-none" />
      <div className="absolute top-6 left-6 z-[1000] flex flex-col space-y-3">
        <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl border border-white/10">
          <div className="flex items-center space-x-reverse space-x-3">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)] ${activeAreaFilter ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
            <span className="text-[11px] font-black text-slate-200 uppercase tracking-widest">
              {activeAreaFilter ? 'نطاق جغرافي مخصص' : 'تتبع الموقع الجغرافي'}
            </span>
          </div>
        </div>
        {activeAreaFilter && (
          <button 
            onClick={() => {
              drawnItems.current.clearLayers();
              setActiveAreaFilter(false);
              // Trigger a redraw by force if needed, though state change might be enough
              const L_obj = (window as any).L;
              if (L_obj) {
                 clusterGroup.current.clearLayers();
                 properties.forEach(p => {
                    const marker = L_obj.marker([p.lat, p.lng], { icon: L_obj.divIcon({ className: 'custom-price-marker', html: `<div class="price-tag">${formatPriceShort(p.price)}</div>` }) });
                    clusterGroup.current.addLayer(marker);
                 });
              }
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-[1.5rem] text-[10px] font-black shadow-xl transition-all flex items-center justify-center space-x-reverse space-x-2"
          >
            <RotateCcw size={14}/>
            <span>إلغاء التحديد الجغرافي</span>
          </button>
        )}
      </div>
      <div className="absolute bottom-6 right-6 z-[1000] bg-[#0F172A]/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 text-[11px] text-slate-200 font-bold max-w-[240px] text-center shadow-2xl">
        <p className="leading-relaxed">استخدم أدوات الرسم الجانبية لتحديد دائرة أو مربع بحث مخصص. سيتم تصفية العقارات فورياً داخل النطاق المرسوم.</p>
      </div>
    </div>
  );
};

export default MapView;

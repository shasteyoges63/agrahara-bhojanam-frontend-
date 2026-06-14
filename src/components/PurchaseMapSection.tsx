import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { api } from '../api/client';
import type { DeliveryRegion, OrderMapPoint } from '../types';

const KITCHEN_LOCATION = {
  lat: 9.9252,
  lng: 78.1198,
  label: 'Agrahara Bhojanam Kitchen',
  city: 'Madurai, Tamil Nadu 625001',
};

const MAP_VIEWS: Record<DeliveryRegion, { center: [number, number]; zoom: number }> = {
  tamilnadu: { center: [10.45, 78.25], zoom: 7 },
  india: { center: [22.5, 79.0], zoom: 5 },
};

const COPY = {
  home: {
    badge: 'Customer Reach',
    title: 'Where People Buy Our Products',
    subtitle: 'Live order locations across Tamil Nadu and India — each point shows a real customer purchase from our kitchen.',
  },
  contact: {
    badge: 'Locate Us',
    title: 'Find Us & Where Customers Order',
    subtitle: 'Our Madurai kitchen and live customer order points across Tamil Nadu and India.',
  },
} as const;

function formatInr(value: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

interface PurchaseMapSectionProps {
  variant?: keyof typeof COPY;
  embedded?: boolean;
  showKitchenMarker?: boolean;
}

export default function PurchaseMapSection({
  variant = 'home',
  embedded = false,
  showKitchenMarker = variant === 'contact',
}: PurchaseMapSectionProps) {
  const copy = COPY[variant];
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const [region, setRegion] = useState<DeliveryRegion>('tamilnadu');
  const [points, setPoints] = useState<OrderMapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getOrderMapPoints(region === 'india' ? 'all' : region)
      .then(setPoints)
      .catch(() => setPoints([]))
      .finally(() => setLoading(false));
  }, [region]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapInstance.current = map;
    markersLayer.current = L.layerGroup().addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
      markersLayer.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const layer = markersLayer.current;
    if (!map || !layer) return;

    const view = MAP_VIEWS[region];
    map.setView(view.center, view.zoom);

    layer.clearLayers();

    const orderIcon = L.divIcon({
      className: 'ab-map-marker',
      html: '<span></span>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const kitchenIcon = L.divIcon({
      className: 'ab-map-marker ab-map-marker--kitchen',
      html: '<span></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    if (showKitchenMarker) {
      const kitchen = L.marker([KITCHEN_LOCATION.lat, KITCHEN_LOCATION.lng], { icon: kitchenIcon });
      kitchen.bindPopup(
        `<div class="ab-map-popup">
          <strong>${KITCHEN_LOCATION.label}</strong><br/>
          ${KITCHEN_LOCATION.city}<br/>
          Visit our agraharam heritage kitchen
        </div>`
      );
      kitchen.addTo(layer);
    }

    for (const point of points) {
      const marker = L.marker([point.latitude, point.longitude], { icon: orderIcon });
      marker.bindPopup(
        `<div class="ab-map-popup">
          <strong>${point.city}, ${point.state}</strong><br/>
          ${point.customerName}<br/>
          ${formatInr(point.totalPrice)} · ${point.productNames.slice(0, 2).join(', ')}
        </div>`
      );
      marker.addTo(layer);
    }

    const mapPoints: [number, number][] = points.map((p) => [p.latitude, p.longitude]);
    if (showKitchenMarker) mapPoints.push([KITCHEN_LOCATION.lat, KITCHEN_LOCATION.lng]);

    if (mapPoints.length > 0) {
      const bounds = L.latLngBounds(mapPoints);
      map.fitBounds(bounds.pad(region === 'tamilnadu' ? 0.15 : 0.25));
    }
  }, [points, region, showKitchenMarker]);

  const sectionClass = embedded
    ? 'ab-contact-map-section'
    : 'ab-purchase-map-section py-16 md:py-20';

  return (
    <section className={sectionClass}>
      <div className={embedded ? '' : 'max-w-7xl mx-auto px-4'}>
        <div className="ab-section-heading ab-section-heading-plain mb-8">
          <span className="ab-royal-badge mb-3">{copy.badge}</span>
          <h2 className="ab-page-h2 text-xl md:text-2xl">{copy.title}</h2>
          <p className="ab-page-body text-sm mt-2 max-w-2xl mx-auto">{copy.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => setRegion('tamilnadu')}
            className={region === 'tamilnadu' ? 'ab-map-toggle ab-map-toggle--active' : 'ab-map-toggle'}
          >
            Tamil Nadu
          </button>
          <button
            type="button"
            onClick={() => setRegion('india')}
            className={region === 'india' ? 'ab-map-toggle ab-map-toggle--active' : 'ab-map-toggle'}
          >
            All India
          </button>
        </div>

        <div className={embedded ? 'ab-contact-map-frame ab-purchase-map-wrap' : 'ab-purchase-map-wrap'}>
          <div ref={mapRef} className="ab-purchase-map-canvas" aria-label="Customer purchase locations map" />
          <div className="ab-purchase-map-legend">
            <MapPin size={14} className="text-[#c9a227]" />
            <span>
              {loading
                ? 'Loading orders...'
                : `${points.length} order${points.length === 1 ? '' : 's'}${showKitchenMarker ? ' + kitchen' : ''}`}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

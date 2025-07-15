"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { usePlaceStore } from "@/stores/place";
import type { Map as LeafletMap } from "leaflet";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);

const Map = () => {
  const { setPlace } = usePlaceStore();
  const [mounted, setMounted] = useState(false);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import("leaflet");
      
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      setL(leaflet);
      setMounted(true);
    };
    
    loadLeaflet();
  }, []);

  useEffect(() => {
    if (map) {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [map]);

  if (!mounted || !L) {
    return (
      <div className="w-screen h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  const globeIcon = L.icon({
    iconUrl: "/globe.svg",
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const markers = [
    {
      position: [37.5665, 126.978],
      data: {
        title: "번개모임",
        description: "강남 맛집 투어",
        participants: 3,
      },
    },
    {
      position: [37.5575, 126.9865],
      data: {
        title: "정기모임",
        description: "주말 등산 클럽",
        participants: 8,
      },
    },
    {
      position: [37.5635, 126.991],
      data: {
        title: "프리미엄 모임",
        description: "와인 시음회",
        participants: 12,
      },
    },
  ];

  return (
    <div className="w-screen h-full">
      <MapContainer
        ref={setMap}
        center={[37.5665, 126.978]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position as [number, number]}
            icon={globeIcon}
            eventHandlers={{
              click: (e) => {
                L.DomEvent.stopPropagation(e);
                setPlace({ ...marker.data, lat: marker.position[0], lng: marker.position[1] });
              },
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
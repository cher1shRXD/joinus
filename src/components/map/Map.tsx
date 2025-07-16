"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useMeetingStore } from "@/stores/meeting";
import type { Map as LeafletMap } from "leaflet";
import useGeolocation from "@/hooks/common/useGeolocation";
import { customFetch } from "@/libs/fetch/customFetch";
import { Meeting } from "@/types/meeting";
import { useSelectedGroupStore } from "@/stores/selected-group";
import {
  categoryColorMap,
  categoryIconMap,
  UserLocationIcon,
} from "@/components/icons/MapIcons";
import { renderToStaticMarkup } from "react-dom/server";
import { io } from "socket.io-client";
import { useSurveyStore } from "@/stores/survey";
import { Survey } from "@/types/survey";
import { useCustomRouter } from "@/hooks/common/useCustomRouter";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});

interface MapProps {
  searchQuery?: string;
}

export const socketClient = io(process.env.NEXT_PUBLIC_API_URL);

const Map = ({ searchQuery }: MapProps) => {
  const { setMeeting } = useMeetingStore();
  const [mounted, setMounted] = useState(false);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [L, setL] = useState<any>(null);
  const location = useGeolocation();
  const [markers, setMarkers] = useState<Meeting[]>([]);
  const [allMarkers, setAllMarkers] = useState<Meeting[]>([]);
  const { selected } = useSelectedGroupStore();
  const { setData } = useSurveyStore();
  const router = useCustomRouter();

  const getRegularMarkers = async () => {
    console.log("Fetching markers for location:", location.coordinates);
    try {
      const data = await customFetch.get<Meeting[]>(
        `/meetings/regular/nearby?latitude=${location.coordinates?.latitude}&longitude=${location.coordinates?.longitude}`
      );
      console.log("Setting markers:", data);
      setAllMarkers(data || []);
      setMarkers(data || []);
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  const getFlashMarkers = async () => {
    console.log("Fetching markers for location:", location.coordinates);
    try {
      const data = await customFetch.get<{ meetings: Meeting[] }>(
        `/search/meetings?latitude=${location.coordinates?.latitude}&longitude=${location.coordinates?.longitude}&type=flash`
      );
      setAllMarkers(data.meetings || []);
      setMarkers(data.meetings || []);
    } catch (error) {
      console.error("Error fetching markers:", error);
    }
  };

  const getMarkers = async () => {
    if (selected === 0) {
      await getRegularMarkers();
    } else {
      await getFlashMarkers();
    }
  };

  useEffect(() => {
    if (
      location.coordinates &&
      location.coordinates.latitude !== 0 &&
      location.coordinates.longitude !== 0
    ) {
      getMarkers();
    }
  }, [location, selected]);

  useEffect(() => {
    if (!searchQuery?.trim()) {
      setMarkers(allMarkers);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    const filtered = allMarkers.filter(
      (meeting) =>
        meeting.name.toLowerCase().includes(searchTerm) ||
        meeting.description.toLowerCase().includes(searchTerm) ||
        meeting.location.addressString.toLowerCase().includes(searchTerm) ||
        meeting.category.toLowerCase().includes(searchTerm)
    );

    setMarkers(filtered);
  }, [searchQuery, allMarkers]);

  useEffect(() => {
    const loadLeaflet = async () => {
      const leaflet = await import("leaflet");

      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      setL(leaflet);
      setMounted(true);
    };

    socketClient.on(
      "survey-request",
      (data) => {
        setData(data as Survey);
        router.push('/survey');
      }
    );

    loadLeaflet();

    return () => {
      socketClient.disconnect();
    };
  }, []);

  useEffect(() => {
    if (map) {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [map]);

  if (!mounted || !L || !location.loaded) {
    return (
      <div className="w-screen h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {location.error
              ? "위치 정보를 가져올 수 없습니다."
              : "Loading map..."}
          </p>
        </div>
      </div>
    );
  }

  const createCustomIcon = (category: string, amount: number) => {
    const IconComponent = categoryIconMap[category] || categoryIconMap["all"];
    const backgroundColor =
      categoryColorMap[category] || categoryColorMap["all"];

    const iconHtml = renderToStaticMarkup(
      <IconComponent
        className={`${
          amount > 4
            ? "w-38 h-38"
            : amount === 3
            ? "w-32 h-32"
            : amount === 2
            ? "w-26 h-26"
            : amount === 1
            ? "w-20 h-20 "
            : "w-14 h-14"
        }`}
        backgroundColor={backgroundColor}
      />
    );

    return L.divIcon({
      html: `<div style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${iconHtml}</div>`,
      className: "custom-meeting-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  const initialCenter: [number, number] =
    location.coordinates &&
    typeof location.coordinates.latitude === "number" &&
    typeof location.coordinates.longitude === "number"
      ? [location.coordinates.latitude, location.coordinates.longitude]
      : [37.5665, 126.978];

  const createUserLocationIcon = () => {
    const userIconHtml = renderToStaticMarkup(
      <UserLocationIcon className="w-10 h-10" />
    );

    return L.divIcon({
      html: `<div style="filter: drop-shadow(0 2px 8px rgba(59,130,246,0.5));">${userIconHtml}</div>`,
      className: "custom-user-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  return (
    <div className="w-screen h-full relative">
      {searchQuery && (
        <div className="absolute top-20 left-4 bg-white px-3 py-2 rounded-lg shadow-md z-40">
          <span className="text-sm text-gray-600">
            {markers.length}개의 모임을 찾았습니다
          </span>
        </div>
      )}

      <MapContainer
        ref={setMap}
        center={initialCenter}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {markers.map((marker) => {
          console.log("Rendering marker:", marker);
          return (
            <Marker
              key={marker.meetingId}
              position={[marker.location.latitude, marker.location.longitude]}
              icon={createCustomIcon(marker.category, marker.amount)}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  setMeeting(marker);
                },
              }}
            />
          );
        })}

        {location.loaded && location.coordinates && (
          <Marker
            position={[
              location.coordinates.latitude,
              location.coordinates.longitude,
            ]}
            icon={createUserLocationIcon()}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;

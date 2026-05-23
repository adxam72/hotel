import { useEffect, useRef } from "react";

/**
 * Hotel Map Component - Google Maps Integration
 * Displays the hotel location with coordinates: 38°20'29.57"N 66°33'25.21"E
 * Design: Istiqlol Hotel - Central Asian Heritage
 */

interface HotelMapProps {
  onMapReady?: (map: google.maps.Map) => void;
}

export default function HotelMap({ onMapReady }: HotelMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || typeof google === "undefined") return;

    // Hotel coordinates: 38°20'29.57"N 66°33'25.21"E
    const hotelLocation = {
      lat: 38.341547,
      lng: 66.557003,
    };

    // Initialize map
    map.current = new (window as any).google.maps.Map(mapContainer.current, {
      zoom: 15,
      center: hotelLocation,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      styles: [
        {
          featureType: "all",
          elementType: "geometry",
          stylers: [{ color: "#f5f5f5" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#c9c9c9" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9e9e9e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [{ color: "#ffffff" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#e0e0e0" }],
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [{ color: "#eeeeee" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#757575" }],
        },
      ],
    });

    // Add marker for hotel
    const marker = new (window as any).google.maps.Marker({
      position: hotelLocation,
      map: map.current,
      title: "Istiqlol Mehmonxonasi",
      icon: {
        path: (window as any).google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#8B7355",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      },
    });

    // Add info window
    const infoWindow = new (window as any).google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; font-family: 'Poppins', sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-family: 'Playfair Display', serif; color: #1A1A1A; font-size: 18px;">
            Istiqlol Mehmonxonasi
          </h3>
          <p style="margin: 0 0 6px 0; color: #666; font-size: 14px;">
            Karashina shahar, Dehqonobod tumani
          </p>
          <p style="margin: 0; color: #2C5F7F; font-size: 14px; font-weight: 600;">
            +998 99 091 58 58
          </p>
        </div>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(map.current, marker);
    });

    // Open info window by default
    infoWindow.open(map.current, marker);

    if (onMapReady && map.current) {
      onMapReady(map.current);
    }
  }, [onMapReady]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[500px] rounded-lg shadow-lg overflow-hidden"
      style={{ minHeight: "500px" }}
    />
  );
}

import React from "react";
import { Map, type MapRef } from "react-map-gl";
import { env } from "~/env.mjs";

const useGetMapContextValue = () => {
  const mapRef = React.useRef<MapRef | null>(null);

  return mapRef;
};

type MapContextValue = ReturnType<typeof useGetMapContextValue>;

const MapContext = React.createContext<MapContextValue | null>(null);

export function useMapContext() {
  const context = React.useContext(MapContext);

  if (!context) {
    throw new Error("useMapContext must be used within a MapContextProvider");
  }

  return context;
}

export default function CustomMap({ children }: { children: React.ReactNode }) {
  const mapRef = useGetMapContextValue();

  const token = env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <MapContext.Provider value={mapRef}>
      <Map
        ref={mapRef}
        mapboxAccessToken={token}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        initialViewState={{
          longitude: -74,
          latitude: 40.6,
          zoom: 9,
        }}
      >
        {children}
      </Map>
    </MapContext.Provider>
  );
}

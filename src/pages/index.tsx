import Head from "next/head";
import { useRef } from "react";
import { api } from "~/utils/api";
import { Map, MapRef } from "react-map-gl";
import { env } from "~/env.mjs";

function MapboxMarker({
  map,
  latlong,
}: {
  map: mapboxgl.Map | null;
  latlong: [number, number];
}) {
  const markerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  function zoomMapToMarker() {
    if (!map) return;
    map.flyTo({ center: latlong, zoom: map.getZoom() });
    popupRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div
        ref={markerRef}
        onClick={zoomMapToMarker}
        className="rounded-full border-2 border-slate-50 bg-sky-500 p-2"
      />
      <div className="flex flex-col" ref={popupRef}>
        <h1 className="text-semibold text-lg">Marker</h1>
        <p className="text-sm text-slate-500">Marker description</p>
      </div>
    </>
  );
}

export default function Home() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapRef | null>(null);

  const { data, mutate } = api.map.searchByName.useMutation();

  function handleCitySearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const city = formData.get("city") as string;
    mutate({ city });
  }

  function goToMapLocation(center: [number, number]) {
    map.current?.flyTo({ center, zoom: 11 });
  }

  return (
    <>
      <Head>
        <title>Meetme</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen">
        <nav className="flex flex w-full max-w-sm flex-col overflow-y-auto border-r border-slate-400 bg-slate-100 p-8 text-slate-950">
          <form
            className="flex flex-col gap-4 pb-12"
            onSubmit={handleCitySearch}
          >
            <h1 className="text-semibold text-xl">Search for a city</h1>
            <input
              type="text"
              name="city"
              id="city"
              placeholder="City Name, New York, Los Angeles etc..."
              className="rounded-md border border-slate-400 bg-transparent p-2"
            />
            <button className="rounded-md bg-sky-500 p-2 text-slate-50">
              Search
            </button>
          </form>
          {data && (
            <div className="grid divide-y divide-slate-400 border-y border-slate-400">
              {data?.data?.features?.map((feature) => (
                <div
                  key={feature.place_name}
                  className="flex flex-col gap-4 py-6"
                >
                  <span>{feature.place_name}</span>
                  <button
                    onClick={() =>
                      goToMapLocation([feature.center[0]!, feature.center[1]!])
                    }
                    className="w-min rounded-md bg-emerald-500 px-4 py-1 text-slate-50"
                  >
                    Find
                  </button>
                </div>
              ))}
            </div>
          )}
        </nav>
        <Map
          ref={map}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
          initialViewState={{
            longitude: -74,
            latitude: 40.6,
            zoom: 9,
          }}
          style={{ flex: 1 }}
        ></Map>
      </main>
    </>
  );
}

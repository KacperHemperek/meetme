import React from "react";
import { Map, type MapRef } from "react-map-gl";
import { env } from "~/env.mjs";
import { cn } from "~/utils/cn";

function Label({
  children,
  ...rest
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  children: React.ReactNode;
}) {
  return (
    <label className="pb-1 text-xs text-stone-600" htmlFor={rest.id}>
      {children}
    </label>
  );
}

export function Input({
  label,
  id,
  disabled,
  name,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
}) {
  const mapRef = React.useRef<MapRef>(null);

  const inputClassNames =
    "rounded-md border border-stone-600 bg-transparent px-3 py-2 text-stone-50 outline-none";

  if (rest.type === "map")
    return (
      <div
        className={cn(
          "flex flex-col",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <Label htmlFor={id}>{label}</Label>
        <input
          type="text"
          name={name}
          id={id}
          className={inputClassNames}
          disabled={disabled}
        />
        <div className="flex h-96 w-full pt-6">
          <Map
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
            ref={mapRef}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            initialViewState={{
              zoom: 10,
              latitude: 37.7577,
              longitude: -122.4376,
            }}
          ></Map>
        </div>
      </div>
    );

  return (
    <div
      className={cn(
        "relative flex flex-col",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <Label htmlFor={id}>{label}</Label>
      <input {...rest} className={inputClassNames} disabled={disabled} />
    </div>
  );
}

export function TextArea({
  disabled,
  label,
  ...rest
}: React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <Label htmlFor={rest.id}>{label}</Label>
      <textarea
        className="calendar-input rounded-md border border-stone-600 bg-transparent px-3 py-2 text-stone-50 outline-none"
        disabled={disabled}
        {...rest}
      />
    </div>
  );
}

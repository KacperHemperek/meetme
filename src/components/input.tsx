import React, { forwardRef } from "react";
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

export function MapInput({ name }: { name: string }) {
  return "map";
  // <div
  //   className={cn(
  //     "flex flex-col",
  //     disabled && "pointer-events-none opacity-50",
  //   )}
  // >
  //   <Label htmlFor={id}>{label}</Label>
  //   <input
  //     type="text"
  //     name={name}
  //     id={id}
  //     className={inputClassNames}
  //     disabled={disabled}
  //   />
  //   <div className="flex h-80 w-full pt-6">
  //     <Map
  //       mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
  //       ref={mapRef}
  //       mapStyle="mapbox://styles/mapbox/dark-v11"
  //       initialViewState={{
  //         zoom: 10,
  //         latitude: 37.7577,
  //         longitude: -122.4376,
  //       }}
  //     ></Map>
  //   </div>
  // </div>
}

export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  }
>(({ label, disabled, ...rest }, ref) => {
  const inputClassNames =
    "rounded-md border border-stone-600 bg-transparent px-3 py-2 text-stone-50 outline-none";

  return (
    <div
      className={cn(
        "relative flex flex-col",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <Label htmlFor={rest.name}>{label}</Label>
      <input
        {...rest}
        id={rest.name}
        ref={ref}
        className={inputClassNames}
        disabled={disabled}
      />
    </div>
  );
});

Input.displayName = "Input";

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.InputHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
  }
>(({ disabled, label, ...rest }, ref) => {
  return (
    <div
      className={cn(
        "relative flex flex-col",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <Label htmlFor={rest.name}>{label}</Label>
      <textarea
        ref={ref}
        className="calendar-input rounded-md border border-stone-600 bg-transparent px-3 py-2 text-stone-50 outline-none"
        disabled={disabled}
        id={rest.name}
        {...rest}
      />
    </div>
  );
});

TextArea.displayName = "TextArea";

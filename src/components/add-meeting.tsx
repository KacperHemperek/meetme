import React from "react";
import * as D from "@radix-ui/react-dialog";
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
    <label className="pb-1 text-sm text-stone-600" htmlFor={rest.id}>
      {children}
    </label>
  );
}

function Input({
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
    "rounded-md border border-stone-50 bg-transparent px-3 py-2 text-stone-50 outline-none";

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

function TextArea({
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
        className="calendar-input rounded-md border border-stone-50 bg-transparent px-3 py-2 text-stone-50 outline-none"
        disabled={disabled}
        {...rest}
      />
    </div>
  );
}

export default function AddMeeting({
  toggle,
  open,
  trigger,
}: {
  toggle: (val: boolean) => void;
  open: boolean;
  trigger?: React.ReactNode;
}) {
  return (
    <D.Root open={open} onOpenChange={toggle}>
      <D.Overlay className="fixed inset-0 z-40 flex items-center justify-center bg-stone-900/20 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"></D.Overlay>
      <D.Portal>
        <D.Content className="animate-popup scrollbar-thin scrollbar-thumb-stone-400 scrollbar-track- fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100%-4rem)] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-auto rounded-lg bg-stone-950 p-6 text-slate-50 shadow-lg">
          <h1 className="text-2xl font-semibold">Create a meeting</h1>
          <Input type="" label="Meeting name" id="meeting-name" />
          <TextArea label="Meeting Description" id="description" />
          <Input label="Start Date" id="start-name" type="date" />
          <Input label="End Date" id="end-name" type="date" />
          <Input label="Location" id="location" type="map" />
          <div className="flex gap-6 self-end">
            <button
              className="rounded-md bg-rose-500 px-4 py-2 disabled:opacity-50"
              disabled
            >
              Cancel
            </button>
            <button className="rounded-md bg-emerald-500 px-4 py-2">
              Add Meeting
            </button>
          </div>
        </D.Content>
      </D.Portal>
      <D.Trigger asChild>{trigger}</D.Trigger>
    </D.Root>
  );
}

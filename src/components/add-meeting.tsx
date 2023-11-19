import React from "react";
import * as D from "@radix-ui/react-dialog";
import { Map, type MapRef } from "react-map-gl";
import { env } from "~/env.mjs";

function Input({
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
}) {
  const mapRef = React.useRef<MapRef>(null);

  if (rest.type === "date") {
    return (
      <div className="relative flex flex-col">
        <label htmlFor={rest.id}>{rest.label}</label>
        <input {...rest} type="date" />
      </div>
    );
  }

  if (rest.type === "map")
    return (
      <div>
        <label htmlFor="location">Location</label>
        <input type="text" name="location" id="location" className="w-full" />
        <div className="flex h-96 w-full">
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
    <div className="relative flex flex-col">
      <label htmlFor={rest.id}>{rest.label}</label>
      <input {...rest} />
    </div>
  );
}

function TextArea({
  ...rest
}: React.InputHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
}) {
  return (
    <div className="relative flex flex-col">
      <label htmlFor={rest.id}>{rest.label}</label>
      <textarea {...rest} />
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
        <D.Content className="animate-popup fixed left-1/2 top-1/2 z-50 flex w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-auto rounded-lg bg-stone-950 p-6 text-slate-50 [&>div>input]:text-black [&>div>textarea]:text-black">
          <h1 className="text-2xl font-semibold">Create a meeting</h1>
          <Input type="" label="Meeting name" id="meeting-name" />
          <TextArea label="Meeting Description" id="description" />
          <Input label="Start Date" id="start-name" type="date" />
          <Input label="End Date" id="end-name" type="date" />
          <Input label="Location" id="location" type="map" />
        </D.Content>
      </D.Portal>
      <D.Trigger asChild>{trigger}</D.Trigger>
    </D.Root>
  );
}

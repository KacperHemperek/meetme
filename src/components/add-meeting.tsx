import React from "react";
import * as D from "@radix-ui/react-dialog";
import { Input, TextArea } from "~/components/input";
import Button from "~/components/button";

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
        <D.Content className="animate-popup scrollbar-thin scrollbar-thumb-stone-400 scrollbar-track- fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100%-2rem)] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-auto rounded-lg bg-stone-950 p-6 text-slate-50 shadow-lg">
          <h1 className="text-2xl font-semibold">Create a meeting</h1>
          <Input type="" label="Meeting name" id="meeting-name" />
          <TextArea label="Meeting Description" id="description" />
          <Input label="Start Date" id="start-name" type="date" />
          <Input label="End Date" id="end-name" type="date" />
          <Input label="Location" id="location" type="map" />
          <div className="flex gap-6 self-end">
            <Button variant="danger" onClick={() => toggle(false)}>
              Cancel
            </Button>
            <Button>Create</Button>
          </div>
        </D.Content>
      </D.Portal>
      <D.Trigger asChild>{trigger}</D.Trigger>
    </D.Root>
  );
}

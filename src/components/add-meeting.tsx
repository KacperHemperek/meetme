import React from "react";
import * as D from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import { Input, TextArea } from "~/components/input";
import Button from "~/components/button";
import { api } from "~/utils/api";
import { ImageInput } from "~/components/image-input";

type AddMeetingForm = {
  image: {
    dataUrl: string;
    contentType: string;
  } | null;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
};

export default function AddMeeting({
  toggle,
  open,
  trigger,
}: {
  toggle: (val: boolean) => void;
  open: boolean;
  trigger?: React.ReactNode;
}) {
  const { mutate, isLoading } = api.meetings.create.useMutation({
    onSuccess: () => {
      toggle(false);
    },
  });

  const { control, handleSubmit } = useForm<AddMeetingForm>();

  function createMeeting(data: AddMeetingForm) {
    mutate({
      description: data.description,
      title: data.name,
      startTime: data.startDate,
      endTime: data.endDate,
      location: {
        coordinates: [40.73061, -74.935242],
      },
      image: data.image,
    });
  }

  return (
    <D.Root
      open={open}
      onOpenChange={(val) => {
        if (isLoading) return;
        toggle(val);
      }}
    >
      <D.Overlay className="fixed inset-0 z-40 flex items-center justify-center bg-stone-900/20 backdrop-blur-sm transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"></D.Overlay>
      <D.Portal>
        <D.Content asChild>
          <form
            onSubmit={handleSubmit(createMeeting)}
            className="animate-popup scrollbar-track- fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100%-2rem)] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col gap-6 overflow-auto rounded-lg bg-stone-950 p-6 text-slate-50 shadow-lg scrollbar-thin scrollbar-thumb-stone-400"
          >
            <h1 className="text-2xl font-semibold">Create a meeting</h1>
            <Controller
              name="image"
              control={control}
              disabled={isLoading}
              render={({ field }) => (
                <ImageInput
                  image={field.value}
                  setImage={field.onChange}
                  name={field.name}
                  disabled={field.disabled}
                />
              )}
            />
            <Controller
              control={control}
              name="name"
              disabled={isLoading}
              render={({ field }) => (
                <Input {...field} type="text" label="Meeting name" />
              )}
            />
            <Controller
              control={control}
              name="description"
              disabled={isLoading}
              render={({ field }) => (
                <TextArea {...field} label="Meeting Description" />
              )}
            />
            <div className="grid grid-cols-2 gap-6">
              <Controller
                control={control}
                name="startDate"
                disabled={isLoading}
                render={({ field }) => (
                  <Input {...field} label="Start Date" type="date" />
                )}
              />
              <Controller
                control={control}
                name="endDate"
                disabled={isLoading}
                render={({ field }) => (
                  <Input {...field} label="End Date" type="date" />
                )}
              />
            </div>
            <div className="flex gap-6 self-end">
              <Button
                type="reset"
                variant="danger"
                onClick={() => toggle(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Create
              </Button>
            </div>
          </form>
        </D.Content>
      </D.Portal>
      <D.Trigger asChild>{trigger}</D.Trigger>
    </D.Root>
  );
}

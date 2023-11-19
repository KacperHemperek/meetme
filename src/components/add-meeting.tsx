import React, { useState } from "react";
import * as D from "@radix-ui/react-dialog";
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
      <D.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out fixed inset-0 z-40 flex items-center justify-center bg-stone-900/20 backdrop-blur-sm transition-opacity duration-300"></D.Overlay>
      <D.Portal>
        <D.Content className=" data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[45%] data-[state=open]:slide-in-from-top-[45%] data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-stone-950 p-4 text-slate-50">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab
          consequuntur expedita perspiciatis exercitationem fugit reprehenderit
          rem amet ipsa obcaecati, quo quia ullam tempore voluptatum tenetur
          unde dolorem vel iusto necessitatibus eligendi impedit molestias
          praesentium tempora! Saepe veniam incidunt iste excepturi veritatis
          non dignissimos soluta fugiat, ratione sapiente fugit debitis tempore
          unde nemo laudantium rem nisi cum expedita iusto quasi natus quos
          culpa labore doloribus. Corporis sequi odio ducimus necessitatibus
          nihil non animi quia impedit quod in? Tempora, qui id iusto distinctio
          quas pariatur quidem placeat repudiandae hic aperiam facere quasi
          nulla. Illum perspiciatis fugit consectetur dignissimos eligendi,
          autem non nisi.
        </D.Content>
      </D.Portal>
      <D.Trigger asChild>{trigger}</D.Trigger>
    </D.Root>
  );
}

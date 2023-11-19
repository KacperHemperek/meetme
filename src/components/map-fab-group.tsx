import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import AddMeeting from "~/components/add-meeting";

function useDialogControls() {
  const [dialogShown, setDialogShown] = useState(false);

  function openDialog() {
    setDialogShown(true);
  }

  function closeDialog() {
    setDialogShown(false);
  }

  function toggleDialog(val: boolean) {
    setDialogShown(val);
  }

  return {
    dialogShown,
    closeDialog,
    openDialog,
    toggleDialog,
  };
}

const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    message: string | React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
  }
>(({ children, message, onClick }, ref) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipPortal>
          <TooltipContent
            side="left"
            sideOffset={4}
            className="data-[state=delayed-open]:animate-in data-[state=delayed-open]:slide-in-from-left-1 data-[state=delayed-open]:fade-in data rounded-md bg-stone-900 p-2 text-sm text-slate-50 shadow"
          >
            {message}
            <TooltipArrow
              className="-translate-y-[1px] fill-stone-900 text-stone-900 shadow"
              width={14}
              height={7}
            />
          </TooltipContent>
        </TooltipPortal>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            ref={ref}
            className="rounded-full bg-emerald-500 p-3 transition-opacity hover:opacity-90"
          >
            {children}
          </button>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
});
FloatingActionButton.displayName = "FloatingActionButton";

export default function MapFabGroup() {
  const { dialogShown, openDialog, toggleDialog } = useDialogControls();

  return (
    <>
      <AddMeeting open={dialogShown} toggle={toggleDialog} />
      <div className="fixed bottom-12 right-12 z-10 flex flex-col gap-6 bg-transparent">
        <FloatingActionButton message="Create a meeting" onClick={openDialog}>
          <Plus className="h-6 w-6 text-slate-50" />
        </FloatingActionButton>
      </div>
    </>
  );
}

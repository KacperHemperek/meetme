import React from "react";
import { cn } from "~/utils/cn";

type ButtonVariants = "primary" | "danger";

export default function Button({
  variant = "primary",
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariants;
}) {
  const variants: Record<ButtonVariants, string> = {
    primary: "bg-emerald-500",
    danger: "bg-rose-500",
  };

  return (
    <button {...rest} className={cn(variants[variant], "rounded-md px-4 py-2")}>
      {children}
    </button>
  );
}

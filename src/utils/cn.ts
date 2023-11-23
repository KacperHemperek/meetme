import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  // eslint-disable-next-line
  return twMerge(clsx(...inputs)) as string;
}

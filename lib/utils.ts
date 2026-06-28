// This file is a utility module that provides a function for combining and merging CSS class names. It uses the `clsx` library to conditionally join class names and the `tailwind-merge` library to merge Tailwind CSS classes effectively. 

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
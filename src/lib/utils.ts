import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// "John Melvin" -> "JM"
export const initials = (name: string) =>
	name
		.split(" ")
		.filter((w) => /^[a-z0-9]/i.test(w)) // skip "—", "&" etc.
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

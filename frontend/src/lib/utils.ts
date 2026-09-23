import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLeadTime(hours: number): string {
  const days = (hours / 24).toFixed(1);
  return `+${hours}h (Day ${days})`;
}

export function getSeverityBadgeClass(severity: string): string {
  switch (severity) {
    case 'Extreme Warning':
      return 'bg-red-950/80 text-red-300 border border-red-500/50 shadow-sm';
    case 'Warning':
      return 'bg-amber-950/80 text-amber-300 border border-amber-500/50';
    case 'Watch':
      return 'bg-orange-950/80 text-orange-300 border border-orange-500/50';
    case 'Advisory':
      return 'bg-blue-950/80 text-blue-300 border border-blue-500/50';
    default:
      return 'bg-slate-800 text-slate-300 border border-slate-700';
  }
}

export function getEfiColor(efi: number): string {
  const abs = Math.abs(efi);
  if (abs >= 0.9) return '#C00000'; // Red
  if (abs >= 0.75) return '#F28C28'; // Orange accent
  if (abs >= 0.5) return '#FFD966'; // Yellow
  return '#38BDF8'; // Sky blue
}

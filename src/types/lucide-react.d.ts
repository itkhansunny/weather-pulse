declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  
  export type LucideIcon = ComponentType<LucideProps>;

  export const Sun: LucideIcon;
  export const Moon: LucideIcon;
  export const CloudSun: LucideIcon;
  export const Download: LucideIcon;
  export const Loader2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Compass: LucideIcon;
  export const CompassIcon: LucideIcon;
  export const ArrowUp: LucideIcon;
  export const ArrowDown: LucideIcon;
  export const Eye: LucideIcon;
  export const Clock: LucideIcon;
  export const Wind: LucideIcon;
  export const Droplets: LucideIcon;
  export const Droplet: LucideIcon;
  export const Gauge: LucideIcon;
  export const Cloud: LucideIcon;
  export const Thermometer: LucideIcon;
  export const Navigation: LucideIcon;
  export const Search: LucideIcon;
  export const X: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Shirt: LucideIcon;
  export const Umbrella: LucideIcon;
  export const Glasses: LucideIcon;
  export const Info: LucideIcon;
}

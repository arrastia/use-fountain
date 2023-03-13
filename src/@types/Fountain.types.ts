export type Direction = 'left' | 'right' | 'both';

export interface FountainOptions {
  direction?: Direction;
  hasGravity?: boolean;
  height?: number;
  isDisabled?: boolean;
  limit?: number;
  size?: number | number[];
  spinSpeed?: number;
  width?: number;
}

export interface Particle {
  direction: number;
  element: HTMLElement;
  left: number;
  size: number;
  distanceWidth: number;
  distanceHeight: number;
  spinSpeed: number;
  spinVal: number;
  top: number;
}

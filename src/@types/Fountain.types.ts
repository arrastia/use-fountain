export type Direction = 'left' | 'right' | 'both';

export interface FountainOptions {
  direction?: Direction;
  gravity?: boolean;
  isDisabled?: boolean;
  limit?: number;
  maxJumpHeight?: number;
  maxJumpWidth?: number;
  size?: number | number[];
  spinSpeed?: number;
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

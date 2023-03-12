import { useEffect, useRef } from 'react';

import { createFountainElement } from './utils/createFountainElement';

import type { FountainOptions } from './@types/Fountain.types';
import type { RefObject } from 'react';

export const useFountain = <T extends HTMLElement>(particles: string | string[], options: FountainOptions): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && particles) return createFountainElement(ref.current, particles, options);
  }, [options, particles]);

  return ref;
};

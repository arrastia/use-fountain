import { getContainer } from './getContainer';

import type { FountainOptions, Particle } from '../@types/Fountain.types';

let instanceCounter = 0;

export function createFountainElement(element: HTMLElement, atoms: string | string[], options: FountainOptions) {
  const {
    direction = 'both',
    gravity = true,
    isDisabled = false,
    limit = 35,
    maxJumpHeight = 5,
    maxJumpWidth = 25,
    spinSpeed = 10,
    size: sizes = [15, 20, 25, 35, 45]
  } = options;

  instanceCounter++;

  let particles: Particle[] = [];
  let autoAddParticle = false;
  let mouseX = 0;
  let mouseY = 0;

  const container = getContainer();

  function createParticle() {
    const size = Array.isArray(sizes) ? sizes[Math.floor(Math.random() * sizes.length)] : sizes;
    const distanceWidth = Math.random() * 5;
    const distanceHeight = Math.random() * 25;
    const spinVal = Math.random() * 0;
    const spinSpeed = Math.random() * 10 * (Math.random() <= 0.5 ? -1 : 1);
    const top = mouseY - size / 2;
    const left = mouseX - size / 2;
    const direction = Math.random() <= 0.5 ? -1 : 1;

    const particle = document.createElement('div');
    particle.innerHTML = Array.isArray(atoms) ? atoms[Math.floor(Math.random() * atoms.length)] : atoms;
    particle.setAttribute(
      'style',
      ['position:absolute', 'font-size:200px', 'will-change:transform', `top:${top}px`, `left:${left}px`, `transform:rotate(${spinVal}deg)`].join(';')
    );

    container.appendChild(particle);

    particles.push({ direction, element: particle, left, size, distanceWidth, distanceHeight, spinSpeed, spinVal, top });
  }

  function updateParticles() {
    particles.forEach(p => {
      p.left = gravity ? p.left - p.distanceWidth * p.direction : p.left + p.distanceWidth * p.direction;

      p.top = gravity ? p.top - p.distanceHeight : p.top + p.distanceHeight;

      p.distanceHeight = Math.min(p.size, p.distanceHeight - 1);
      p.spinVal = p.spinVal + p.spinSpeed;

      if (gravity) {
        if (p.top >= Math.max(window.innerHeight, document.body.clientHeight) + p.size) {
          particles = particles.filter(o => o !== p);
          p.element.remove();
        }
      } else {
        if (p.top + p.size <= 0) {
          particles = particles.filter(o => o !== p);
          p.element.remove();
        }
      }

      p.element.setAttribute(
        'style',
        [
          'position:absolute',
          `font-size:${p.size}px`,
          'will-change:transform',
          `top:${p.top}px`,
          `left:${p.left}px`,
          `transform:rotate(${p.spinVal}deg)`
        ].join(';')
      );
    });
  }

  let animationFrame: number | undefined;

  function loop() {
    if (autoAddParticle && particles.length < limit) createParticle();

    updateParticles();
    animationFrame = requestAnimationFrame(loop);
  }

  loop();

  const isTouchInteraction = 'ontouchstart' in window || navigator.maxTouchPoints;

  const tap = isTouchInteraction ? 'touchstart' : 'mousedown';
  const tapEnd = isTouchInteraction ? 'touchend' : 'mouseup';
  const move = isTouchInteraction ? 'touchmove' : 'mousemove';

  const updateMousePosition = (event: MouseEvent | TouchEvent) => {
    if ('touches' in event) {
      mouseX = event.touches?.[0].clientX;
      mouseY = event.touches?.[0].clientY;
    } else {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }
  };

  const tapHandler = (event: MouseEvent | TouchEvent) => {
    if (isDisabled) return;

    updateMousePosition(event);
    autoAddParticle = true;
  };

  const disableAutoAddParticle = () => (autoAddParticle = false);

  element.addEventListener(move, updateMousePosition, { passive: true });
  element.addEventListener(tap, tapHandler, { passive: true });
  element.addEventListener(tapEnd, disableAutoAddParticle, { passive: true });
  element.addEventListener('mouseleave', disableAutoAddParticle, { passive: true });

  return () => {
    element.removeEventListener(move, updateMousePosition);
    element.removeEventListener(tap, tapHandler);
    element.removeEventListener(tapEnd, disableAutoAddParticle);
    element.removeEventListener('mouseleave', disableAutoAddParticle);

    const interval = setInterval(() => {
      if (animationFrame && particles.length === 0) {
        cancelAnimationFrame(animationFrame);
        clearInterval(interval);

        if (--instanceCounter === 0) container.remove();
      }
    }, 500);
  };
}

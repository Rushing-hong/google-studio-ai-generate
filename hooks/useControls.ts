
import { useState, useEffect } from 'react';
import { Controls } from '../types';

export const useControls = (): Controls => {
  const [controls, setControls] = useState<Controls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    flashlight: true, // Default to on
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setControls(c => ({ ...c, forward: true })); break;
        case 'KeyS': setControls(c => ({ ...c, backward: true })); break;
        case 'KeyA': setControls(c => ({ ...c, left: true })); break;
        case 'KeyD': setControls(c => ({ ...c, right: true })); break;
        case 'ArrowUp': setControls(c => ({ ...c, up: true })); break;
        case 'ArrowDown': setControls(c => ({ ...c, down: true })); break;
        case 'KeyF': setControls(c => ({ ...c, flashlight: !c.flashlight })); break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setControls(c => ({ ...c, forward: false })); break;
        case 'KeyS': setControls(c => ({ ...c, backward: false })); break;
        case 'KeyA': setControls(c => ({ ...c, left: false })); break;
        case 'KeyD': setControls(c => ({ ...c, right: false })); break;
        case 'ArrowUp': setControls(c => ({ ...c, up: false })); break;
        case 'ArrowDown': setControls(c => ({ ...c, down: false })); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controls;
};


export interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  flashlight: boolean;
}

export interface SubmarineState {
  position: [number, number, number];
  rotation: [number, number, number];
  depth: number;
}

// Restored MissionState to support optional mission-based components like Samples.tsx
export interface MissionState {
  samplesCollected: number;
}

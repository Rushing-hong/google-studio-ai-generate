
import React, { useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MissionState } from '../types';

interface SamplesProps {
  count: number;
  mission: MissionState;
  updateMission: (update: Partial<MissionState>) => void;
}

const Sample: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.02;
  });

  return (
    <mesh ref={meshRef} position={position} name="mineral_sample">
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} />
      <pointLight color="#00ffcc" intensity={0.5} distance={3} />
    </mesh>
  );
};

const Samples: React.FC<SamplesProps> = ({ count, mission, updateMission }) => {
  const [samplePositions, setSamplePositions] = useState<[number, number, number][]>([]);

  useEffect(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * 60,
        -18.5, 
        (Math.random() - 0.5) * 60
      ]);
    }
    setSamplePositions(pos);
  }, [count]);

  useFrame((state) => {
    // Find the player more specifically
    const sub = state.scene.getObjectByName('player_submarine');
    if (!sub) return;

    const subPos = sub.position;

    setSamplePositions(prev => {
      const remaining = prev.filter(p => {
        const dist = subPos.distanceTo(new THREE.Vector3(...p));
        if (dist < 2.0) {
          updateMission({ samplesCollected: mission.samplesCollected + 1 });
          return false;
        }
        return true;
      });
      // Only trigger a state update if something was collected
      return remaining.length !== prev.length ? remaining : prev;
    });
  });

  return (
    <group>
      {samplePositions.map((p, i) => (
        <Sample key={`${p[0]}-${p[2]}`} position={p} />
      ))}
    </group>
  );
};

export default Samples;

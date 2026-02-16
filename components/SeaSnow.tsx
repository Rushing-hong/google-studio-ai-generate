
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SeaSnow: React.FC<{ count?: number }> = ({ count = 2500 }) => {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 150;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 150;
      sz[i] = 0.02 + Math.random() * 0.12;
    }
    return [pos, sz];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y -= 0.005; // Very slow drift
    if (meshRef.current.position.y < -40) meshRef.current.position.y = 40;
    
    // Slight sway to simulate water currents
    meshRef.current.position.x += Math.sin(state.clock.elapsedTime * 0.2) * 0.001;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-size" 
          count={count} 
          array={sizes} 
          itemSize={1} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} 
        color="#ddd" 
        transparent 
        opacity={0.3} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default SeaSnow;

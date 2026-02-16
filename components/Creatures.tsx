
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshDistortMaterial } from '@react-three/drei';

const CombJelly: React.FC<{ position: [number, number, number]; color: string; delay: number }> = ({ position, color, delay }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime() + delay;
    
    // Realistic floating motion
    groupRef.current.position.y += Math.sin(time * 0.3) * 0.012;
    groupRef.current.position.x += Math.cos(time * 0.15) * 0.008;
    groupRef.current.rotation.y += 0.002;
    
    // Defensive property update: check current is explicitly defined
    const mat = glowMaterialRef.current;
    if (mat) {
        mat.emissiveIntensity = 2.5 + Math.sin(time * 3) * 2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer Membrane (Gelatinous) */}
      <mesh>
        <sphereGeometry args={[0.7, 48, 48]} />
        <MeshDistortMaterial 
          speed={1.5} 
          distort={0.25} 
          radius={1} 
          color="#ffffff" 
          transparent 
          opacity={0.12} 
          transmission={1}
          thickness={1.5}
          clearcoat={0.5}
        />
      </mesh>
      
      {/* Biological Cilia/Prisms */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} rotation={[0, (i / 8) * Math.PI * 2, 0]}>
          <boxGeometry args={[0.01, 1.4, 0.01]} />
          <meshStandardMaterial 
            ref={i === 0 ? glowMaterialRef : null} 
            color={color} 
            emissive={color} 
            emissiveIntensity={3} 
            transparent 
            opacity={0.9}
          />
        </mesh>
      ))}
      
      <pointLight distance={10} intensity={0.6} color={color} />
    </group>
  );
};

const Creatures: React.FC<{ count?: number }> = ({ count = 15 }) => {
  const data = useMemo(() => {
    return [...Array(count)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 18 + 1,
        (Math.random() - 0.5) * 140,
      ] as [number, number, number],
      color: ['#00ffff', '#ff00ff', '#55ffaa', '#ffbb00'][i % 4],
      delay: Math.random() * 20,
    }));
  }, [count]);

  return (
    <group>
      {data.map((d, i) => (
        <CombJelly key={i} {...d} />
      ))}
    </group>
  );
};

export default Creatures;

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MigratingFishSchool: React.FC<{ color: string; speed?: number; delay?: number; offset?: [number, number, number] }> = ({ 
  color, 
  speed = 0.2, 
  delay = 0,
  offset = [0, 0, 0]
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 120; // Doubled fish count
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const progressRef = useRef(-120); 

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() + delay;
    
    progressRef.current += speed;
    
    if (progressRef.current > 120) {
      progressRef.current = -150;
    }

    const groupX = offset[0] + Math.sin(time * 0.2) * 20; 
    const groupY = offset[1] + Math.cos(time * 0.3) * 8 - 5; 
    const groupZ = progressRef.current + offset[2];

    for (let i = 0; i < count; i++) {
      const t = time + i * 0.15;
      
      const offsetX = Math.sin(t * 2.5) * 2.5;
      const offsetY = Math.cos(t * 2.0) * 1.5;
      const offsetZ = Math.sin(t * 0.8) * 3.0 + (i % 10) * 0.8;

      dummy.position.set(groupX + offsetX, groupY + offsetY, groupZ + offsetZ);
      
      dummy.rotation.set(
        Math.cos(t) * 0.15, 
        Math.PI + Math.sin(time * 0.1) * 0.3, 
        Math.sin(t) * 0.15
      );
      
      dummy.scale.setScalar(0.09 + Math.sin(t * 0.5) * 0.03);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.4, 2, 6]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={3} 
        transparent 
        opacity={0.9}
      />
    </instancedMesh>
  );
};

const GiantSquid: React.FC = () => {
  const ref = useRef<THREE.Group>(null);
  const [active, setActive] = React.useState(false);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (!active && Math.sin(time * 0.08) > 0.7) setActive(true);
    if (active && Math.sin(time * 0.08) < -0.4) setActive(false);

    if (ref.current && active) {
      ref.current.position.z -= 0.1; 
      ref.current.position.y = -8 + Math.sin(time * 0.4) * 4;
      ref.current.position.x = 50 + Math.cos(time * 0.15) * 15;
      
      if (ref.current.position.z < -120) ref.current.position.z = 120;
    }
  });

  return (
    <group ref={ref} position={[50, -5, 120]} visible={active}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[5, 22, 16]} />
        <meshStandardMaterial color="#0a000a" roughness={1} emissive="#220022" emissiveIntensity={0.3} />
      </mesh>
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[0, -14, 0]} rotation={[0.3, (i / 8) * Math.PI * 2, 0]}>
          <cylinderGeometry args={[0.5, 0.1, 30, 8]} />
          <meshStandardMaterial color="#0a000a" />
        </mesh>
      ))}
      <mesh position={[1.2, 0, 2.5]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <mesh position={[-1.2, 0, 2.5]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <pointLight distance={50} intensity={2} color="#ff0000" />
    </group>
  );
};

const EnvironmentalEvents: React.FC = () => {
  return (
    <group>
      <MigratingFishSchool color="#00ffff" speed={0.25} delay={0} offset={[0, 0, 0]} />
      <MigratingFishSchool color="#ff00ff" speed={0.2} delay={50} offset={[-30, 5, 20]} />
      <MigratingFishSchool color="#00ff88" speed={0.3} delay={120} offset={[25, -10, -30]} />
      <MigratingFishSchool color="#ffff00" speed={0.15} delay={200} offset={[-40, -5, 50]} />
      <MigratingFishSchool color="#ff5500" speed={0.22} delay={80} offset={[40, 8, -60]} />
      
      <GiantSquid />
    </group>
  );
};

export default EnvironmentalEvents;
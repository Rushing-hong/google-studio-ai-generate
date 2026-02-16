import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Float } from '@react-three/drei';

const BasaltRock: React.FC<{ position: [number, number, number]; scale: number; rotation: [number, number, number] }> = ({ position, scale, rotation }) => {
  const geo = useMemo(() => {
    const geometry = new THREE.DodecahedronGeometry(1, 1); 
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const noise = (Math.random() - 0.5) * 0.7;
      pos.setXYZ(i, x + noise, y + noise, z + noise);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <primitive object={geo} attach="geometry" />
      <meshStandardMaterial color="#1a1e24" roughness={0.8} metalness={0.1} />
    </mesh>
  );
};

const HydrothermalVent: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.3, 2, 6, 12]} />
        <meshStandardMaterial color="#2a1e1a" roughness={1} />
      </mesh>
      <mesh position={[0, 6, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ff4400" />
        <pointLight color="#ff2200" intensity={25} distance={35} />
      </mesh>
      {[...Array(8)].map((_, i) => (
        <Float key={i} speed={5} rotationIntensity={0} floatIntensity={4}>
           <mesh position={[0, 6 + i * 1.5, 0]}>
             <sphereGeometry args={[0.4 + i * 0.2, 12, 12]} />
             <meshBasicMaterial color="#333" transparent opacity={0.15} />
           </mesh>
        </Float>
      ))}
    </group>
  );
};

const Terrain: React.FC = () => {
  const geometry = useMemo(() => {
    const size = 500;
    const segments = 180;
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Rougher terrain with more visible heights
      const z = (Math.sin(x * 0.02) * Math.cos(y * 0.02) * 12) + 
                (Math.sin(x * 0.08) * 4.0) + 
                (Math.random() * 0.6);
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const rocks = useMemo(() => {
    return [...Array(120)].map(() => ({
      pos: [(Math.random() - 0.5) * 400, -22, (Math.random() - 0.5) * 400] as [number, number, number],
      scale: 3 + Math.random() * 10,
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number]
    }));
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -22, 0]} receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial 
          color="#11161d" 
          roughness={0.9} 
          metalness={0.0}
          onBeforeCompile={(shader) => {
            shader.vertexShader = `varying vec2 vUv;\n${shader.vertexShader}`;
            shader.vertexShader = shader.vertexShader.replace(
              '#include <uv_vertex>',
              `#include <uv_vertex>\nvUv = uv;`
            );

            shader.fragmentShader = `varying vec2 vUv;\n${shader.fragmentShader}`;
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `
              #include <map_fragment>
              float d = distance(vUv, vec2(0.5));
              diffuseColor.rgb *= (1.0 - smoothstep(0.4, 0.5, d)); 
              `
            );
          }}
        />
      </mesh>

      {rocks.map((r, i) => (
        <BasaltRock key={i} position={r.pos} scale={r.scale} rotation={r.rot} />
      ))}

      <HydrothermalVent position={[50, -22, 60]} />
      <HydrothermalVent position={[-80, -22, -40]} />
      <HydrothermalVent position={[30, -22, -100]} />
      <HydrothermalVent position={[-20, -22, 80]} />
    </group>
  );
};

export default Terrain;
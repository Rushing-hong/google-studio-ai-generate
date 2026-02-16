import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import Submarine from './Submarine';
import Terrain from './Terrain';
import SeaSnow from './SeaSnow';
import Creatures from './Creatures';
import EnvironmentalEvents from './EnvironmentalEvents';

const GameScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 800 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={['#00050a']} />
        
        {/* Adjusted Fog for better visibility */}
        <fogExp2 attach="fog" args={['#00050a', 0.022]} />
        
        {/* Brighter ambient light for subtle silhouette visibility */}
        <ambientLight intensity={0.25} color="#44aaff" />
        <pointLight position={[0, 50, 0]} intensity={0.8} color="#00ffff" distance={300} />

        <Suspense fallback={null}>
          <Terrain />
          <SeaSnow count={2000} />
          
          <Submarine />
          
          <Creatures count={25} />
          
          <EnvironmentalEvents />
          
        </Suspense>

        <Environment preset="night" />
      </Canvas>
    </div>
  );
};

export default GameScene;
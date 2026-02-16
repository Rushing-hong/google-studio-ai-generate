import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from '../hooks/useControls';

const Submarine: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const propellerRef = useRef<THREE.Group>(null);
  const [lightTarget, setLightTarget] = useState<THREE.Object3D | null>(null);
  const controls = useControls();
  const { camera } = useThree();

  const speed = 0.07; 
  const rotationSpeed = 0.008;
  const verticalSpeed = 0.03;

  useFrame((state) => {
    if (!groupRef.current) return;
    const ship = groupRef.current;

    if (controls.forward) ship.translateZ(speed);
    if (controls.backward) ship.translateZ(-speed);
    if (controls.left) ship.rotation.y += rotationSpeed;
    if (controls.right) ship.rotation.y -= rotationSpeed;
    if (controls.up) ship.position.y += verticalSpeed;
    if (controls.down) ship.position.y -= verticalSpeed;

    if (propellerRef.current) {
      propellerRef.current.rotation.z += (controls.forward || controls.backward) ? 0.3 : 0.04;
    }

    if (ship.position.y < -18) ship.position.y = -18;
    if (ship.position.y > 10) ship.position.y = 10;
    
    const idealOffset = new THREE.Vector3(0, 6, -18);
    idealOffset.applyQuaternion(ship.quaternion);
    idealOffset.add(ship.position);
    camera.position.lerp(idealOffset, 0.02);
    camera.lookAt(ship.position);
  });

  const chassisMat = <meshStandardMaterial color="#2d3436" metalness={0.8} roughness={0.6} />;
  const hullMat = <meshPhysicalMaterial color="#1e272e" metalness={0.9} roughness={0.1} clearcoat={1} />;
  const foamMat = <meshStandardMaterial color="#ffcc00" roughness={0.9} />; // Syntactic Foam
  const acrylicMat = <meshPhysicalMaterial color="#ffffff" transparent opacity={0.25} transmission={0.98} thickness={2} roughness={0} />;

  return (
    <group ref={groupRef} position={[0, 0, 0]} name="player_submarine">
      
      {/* CENTRAL TITANIUM SPHERE */}
      <mesh scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[1, 64, 64]} />
        {hullMat}
      </mesh>

      {/* REINFORCED CHASSIS RACK */}
      <group position={[0, -1, 0]}>
        <mesh>
          <boxGeometry args={[3.2, 0.4, 4.5]} />
          {chassisMat}
        </mesh>
        {/* External Battery Pods */}
        {[-1.2, 1.2].map(x => (
          <mesh key={x} position={[x, -0.2, -1]} rotation={[Math.PI / 2, 0, 0]}>
             <cylinderGeometry args={[0.3, 0.3, 1.5, 12]} />
             <meshStandardMaterial color="#222" />
          </mesh>
        ))}
      </group>

      {/* BUOYANCY MODULES (Syntactic Foam) */}
      {[-1, 1].map(side => (
        <mesh key={side} position={[1.5 * side, 0.2, -0.2]}>
          <boxGeometry args={[0.6, 1.2, 3]} />
          {foamMat}
        </mesh>
      ))}

      {/* OPTICAL INTERFACE (Main Viewport) */}
      <group position={[0, 0.1, 1.3]}>
        <mesh>
          <sphereGeometry args={[0.7, 64, 64, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
          {acrylicMat}
        </mesh>
        {/* Sensor Light Inside */}
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#00ffff" distance={2} />
      </group>

      {/* SCIENTIFIC PAYLOAD (Top Sensor Array) */}
      <group position={[0, 1.4, 0.3]}>
        <mesh>
            <cylinderGeometry args={[0.4, 0.5, 0.4, 8]} />
            {chassisMat}
        </mesh>
        <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 1.2]} />
            <meshStandardMaterial color="#888" />
        </mesh>
      </group>

      {/* PROPULSION THRUSTER */}
      <group position={[0, 0, -2.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.7, 0.8, 16, 1, true]} />
          {chassisMat}
        </mesh>
        <group ref={propellerRef}>
          {[0, 1, 2, 3].map(i => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
              <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[0.2, 0.8, 0.04]} />
                <meshStandardMaterial color="#111" metalness={1} />
              </mesh>
            </mesh>
          ))}
        </group>
      </group>

      {/* HIGH-POWER SEARCHLIGHT */}
      <group position={[0, -0.8, 2]}>
        <spotLight 
          visible={controls.flashlight}
          angle={0.7} 
          penumbra={0.3} 
          intensity={1500} 
          distance={250} 
          color="#fafff5" 
          castShadow
          target={lightTarget || undefined}
        />
        <object3D ref={setLightTarget} position={[0, -2, 30]} />
        
        {/* Volumetric Light Scatter - Now Brighter */}
        {controls.flashlight && (
          <mesh position={[0, -2, 30]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 35, 80, 32, 1, true]} />
            <meshBasicMaterial 
              color="#fafff5" 
              transparent 
              opacity={0.12} 
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}
        
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.5, 24]} />
          {chassisMat}
        </mesh>
      </group>

      {/* EXTERNAL HYDRAULIC ARMS */}
      {[[-1, -0.6], [1, -0.6]].map(([x, y], i) => (
        <group key={i} position={[x as number, y as number, 1.6]} rotation={[0.8, 0, 0]}>
            <mesh position={[0, -0.5, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 1.2]} />
                {chassisMat}
            </mesh>
            <mesh position={[0, -1, 0.4]} rotation={[0.9, 0, 0]}>
                <cylinderGeometry args={[0.12, 0.1, 1]} />
                {chassisMat}
            </mesh>
        </group>
      ))}

    </group>
  );
};

export default Submarine;
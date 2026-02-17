import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Floating geometric shapes
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const shapes = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 5,
      ] as [number, number, number],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
      scale: Math.random() * 0.5 + 0.2,
      type: ['octahedron', 'icosahedron', 'tetrahedron'][Math.floor(Math.random() * 3)],
      speed: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={shape.speed}
          rotationIntensity={0.5}
          floatIntensity={1}
        >
          <mesh position={shape.position} rotation={shape.rotation} scale={shape.scale}>
            {shape.type === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
            {shape.type === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
            {shape.type === 'tetrahedron' && <tetrahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial
              color={i % 2 === 0 ? '#00F0FF' : '#8B5CF6'}
              transparent
              opacity={0.15}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

// Animated particles
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const { positions, colors } = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      
      // Cyan to violet gradient
      const t = Math.random();
      colors[i * 3] = t * 0.55 + (1 - t) * 0;
      colors[i * 3 + 1] = t * 0.36 + (1 - t) * 0.94;
      colors[i * 3 + 2] = t * 0.96 + (1 - t) * 1;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Main 3D scene component
export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#080b14']} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00F0FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8B5CF6" />
        
        <FloatingShapes />
        <Particles />
        <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}

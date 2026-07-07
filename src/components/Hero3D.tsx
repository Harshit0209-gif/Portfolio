import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Central mouse-reactive distorted sphere — rotates/tilts toward the cursor
// and pumps its distortion amount up as the pointer moves further off-center.
function InteractiveBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matRef = useRef<any>(null);

  // Offset to the right so it sits beside left-aligned hero text rather than
  // directly behind it.
  const baseX = 1.7;
  const baseY = 0.1;

  useFrame((state, delta) => {
    const { pointer, clock } = state;
    const mesh = meshRef.current;
    if (mesh) {
      mesh.rotation.y += delta * 0.12;
      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, pointer.y * 0.35, 0.04);
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, -pointer.x * 0.15, 0.04);
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, baseX + pointer.x * 0.5, 0.03);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, baseY + pointer.y * 0.3, 0.03);
    }
    if (matRef.current) {
      const targetDistort = 0.3 + Math.min(1, Math.hypot(pointer.x, pointer.y)) * 0.25;
      matRef.current.distort = THREE.MathUtils.lerp(matRef.current.distort, targetDistort, 0.04);
      matRef.current.time = clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[baseX, baseY, 0]}>
      <sphereGeometry args={[1.05, 128, 128]} />
      <MeshDistortMaterial
        ref={matRef}
        color='#F5A623'
        emissive='#E0562A'
        emissiveIntensity={0.35}
        roughness={0.2}
        metalness={0.65}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
        distort={0.3}
        speed={1.6}
      />
    </mesh>
  );
}

// Particle field that gently repels away from the cursor position.
function ReactiveParticles({ count = 260 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.8 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi) * 0.6 - 1.5;
    }
    return arr;
  }, [count]);

  const positions = useMemo(() => basePositions.slice(), [basePositions]);

  useFrame((state) => {
    const { pointer, clock } = state;
    const geometry = pointsRef.current?.geometry;
    const posAttr = geometry?.attributes.position as THREE.BufferAttribute | undefined;
    if (!posAttr) return;

    const t = clock.elapsedTime;
    const mouseX = pointer.x * 3.5;
    const mouseY = pointer.y * 2.5;

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3];
      const by = basePositions[i * 3 + 1];
      const bz = basePositions[i * 3 + 2];

      const driftX = Math.sin(t * 0.25 + i) * 0.12;
      const driftY = Math.cos(t * 0.2 + i * 1.3) * 0.12;

      const dx = bx - mouseX;
      const dy = by - mouseY;
      const dist = Math.hypot(dx, dy);
      const repel = Math.max(0, 1 - dist / 2.2) * 0.8;

      posAttr.setXYZ(
        i,
        bx + driftX + dx * repel,
        by + driftY + dy * repel,
        bz
      );
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color='#F5A623'
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

export default function Hero3D() {
  return (
    <div className='absolute inset-0'>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[4, 4, 4]} intensity={1.4} color='#F5A623' />
        <pointLight position={[-4, -3, -2]} intensity={0.7} color='#E0562A' />
        <Suspense fallback={null}>
          <InteractiveBlob />
          <ReactiveParticles count={220} />
          <Sparkles count={40} scale={5} size={2} speed={0.4} color='#F5A623' opacity={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}

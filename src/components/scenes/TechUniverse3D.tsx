import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { TechGroupId } from '@/content';

export interface UniverseNode {
  id: string;
  name: string;
  group: TechGroupId;
  /** Number of projects the technology appears in — drives the size of its body. */
  count: number;
}

interface TechUniverse3DProps {
  nodes: UniverseNode[];
  groups: { id: TechGroupId; label: string }[];
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  /** Render frames only while true (section on screen and tab visible). */
  active: boolean;
  /** Freeze orbital motion and pointer drift (prefers-reduced-motion). */
  still: boolean;
  /** Small screens: fewer segments, lower pixel ratio, labels only for the focused body. */
  compact: boolean;
}

const GROUP_STYLE: Record<TechGroupId, { color: string; radius: number; tilt: [number, number]; speed: number }> = {
  frontend: { color: '#A9CBE0', radius: 2.5, tilt: [0.16, 0.05], speed: 0.07 },
  motion: { color: '#D8B878', radius: 3.45, tilt: [-0.12, 0.2], speed: -0.055 },
  backend: { color: '#F0A35E', radius: 4.45, tilt: [0.09, -0.16], speed: 0.042 },
  tools: { color: '#8A97AB', radius: 5.4, tilt: [-0.05, 0.1], speed: -0.032 },
};

/** A soft radial sprite for the core's halo — generated once, disposed with the scene. */
function useHaloTexture() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,224,176,1)');
    g.addColorStop(0.2, 'rgba(240,163,94,0.55)');
    g.addColorStop(0.5, 'rgba(240,163,94,0.12)');
    g.addColorStop(1, 'rgba(240,163,94,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Core({ still }: { still: boolean }) {
  const halo = useHaloTexture();
  const mesh = useRef<THREE.Mesh>(null);
  const sprite = useRef<THREE.Sprite>(null);

  useFrame(({ clock }) => {
    if (still) return;
    const t = clock.elapsedTime;
    if (mesh.current) mesh.current.rotation.y = t * 0.12;
    // a slow breath, like a lamp flame
    if (sprite.current) sprite.current.scale.setScalar(5.4 + Math.sin(t * 0.8) * 0.2);
  });

  return (
    <group>
      <sprite ref={sprite} scale={5.4}>
        <spriteMaterial map={halo} blending={THREE.AdditiveBlending} depthWrite={false} transparent />
      </sprite>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.52, 2]} />
        <meshStandardMaterial color='#5A3C18' emissive='#F0A35E' emissiveIntensity={0.9} roughness={0.6} flatShading />
      </mesh>
      <pointLight color='#FFD9A6' intensity={38} distance={16} decay={2} />
    </group>
  );
}

interface OrbitProps extends Pick<TechUniverse3DProps, 'selectedId' | 'hoveredId' | 'onSelect' | 'onHover' | 'still' | 'compact'> {
  group: TechGroupId;
  nodes: UniverseNode[];
  body: THREE.SphereGeometry;
  hit: THREE.SphereGeometry;
}

function Orbit({ group, nodes, body, hit, selectedId, hoveredId, onSelect, onHover, still, compact }: OrbitProps) {
  const style = GROUP_STYLE[group];
  const spin = useRef<THREE.Group>(null);
  // Only hovering pauses and dims; a selection is always present and should not freeze the system.
  const someoneFocused = hoveredId !== null;

  const ring = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * style.radius, 0, Math.sin(a) * style.radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [style.radius]);
  useEffect(() => () => ring.dispose(), [ring]);

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: style.color, emissive: style.color, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.1 }),
    [style.color]
  );
  const hitMaterial = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }), []);
  const ringMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: style.color, transparent: true, opacity: 0.22 }), [style.color]);
  useEffect(
    () => () => {
      material.dispose();
      hitMaterial.dispose();
      ringMaterial.dispose();
    },
    [material, hitMaterial, ringMaterial]
  );

  useFrame((_, delta) => {
    // Orbits hold still while something is focused, so a label never slides out from under the pointer.
    if (still || !spin.current || someoneFocused) return;
    spin.current.rotation.y += Math.min(delta, 0.05) * style.speed;
  });

  // Stagger starting angles between rings so the system never lines up into a spoke.
  const offset = style.radius * 1.7;

  return (
    <group rotation={[style.tilt[0], 0, style.tilt[1]]}>
      <lineLoop geometry={ring} material={ringMaterial} />
      <group ref={spin}>
        {nodes.map((node, i) => {
          const angle = offset + (i / nodes.length) * Math.PI * 2;
          const focused = node.id === selectedId || node.id === hoveredId;
          const size = 0.085 + Math.min(node.count, 9) * 0.011;
          return (
            <group key={node.id} position={[Math.cos(angle) * style.radius, 0, Math.sin(angle) * style.radius]}>
              <mesh geometry={body} material={material} scale={focused ? size * 1.7 : size} />
              <mesh
                geometry={hit}
                material={hitMaterial}
                scale={0.36}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  onHover(node.id);
                }}
                onPointerOut={() => onHover(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(node.id);
                }}
              />
              {(!compact || focused) && (
                <Html center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
                  <span
                    className={`block translate-y-[1.5em] whitespace-nowrap font-sans text-[12px] font-medium transition-[color,opacity] duration-300 ${
                      focused ? 'rounded-[3px] bg-midnight/85 px-1.5 py-0.5 text-[13px] font-semibold text-parchment' : someoneFocused ? 'text-parchment/20' : 'text-parchment/60'
                    }`}
                  >
                    {node.name}
                  </span>
                </Html>
              )}
            </group>
          );
        })}
      </group>
    </group>
  );
}

/** The camera drifts a little toward the pointer — enough to feel depth, never enough to disorient. */
function Rig({ still, height }: { still: boolean; height: number }) {
  const { camera, pointer } = useThree();
  useFrame(() => {
    if (still) return;
    camera.position.x += (pointer.x * 1.4 - camera.position.x) * 0.03;
    camera.position.y += (height + pointer.y * 0.9 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * The technology universe: a warm core with four orbits (one per group). Each body is a
 * technology; its size reflects how many projects it appears in — never a made-up
 * "skill level". Three.js earns its place here: real depth, real occlusion, and a
 * camera that responds to the pointer.
 */
export default function TechUniverse3D({ nodes, groups, selectedId, hoveredId, onSelect, onHover, active, still, compact }: TechUniverse3DProps) {
  const body = useMemo(() => new THREE.SphereGeometry(1, compact ? 14 : 24, compact ? 10 : 18), [compact]);
  const hit = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  const height = compact ? 9.5 : 7.4;
  useEffect(
    () => () => {
      body.dispose();
      hit.dispose();
    },
    [body, hit]
  );

  useEffect(() => {
    document.body.style.cursor = hoveredId ? 'pointer' : '';
    return () => {
      document.body.style.cursor = '';
    };
  }, [hoveredId]);

  return (
    <Canvas
      dpr={[1, compact ? 1.5 : 2]}
      // Looking down from above the plane, so the four orbits open out and labels have room.
      camera={{ position: [0, height, compact ? 17.5 : 14], fov: 40 }}
      // Off screen: no frames at all. Reduced motion: only when something changes.
      frameloop={!active ? 'never' : still ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => onHover(null)}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      aria-hidden='true'
    >
      <ambientLight intensity={0.5} color='#A9CBE0' />
      <Core still={still} />
      {groups.map((g) => (
        <Orbit
          key={g.id}
          group={g.id}
          nodes={nodes.filter((n) => n.group === g.id)}
          body={body}
          hit={hit}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={onSelect}
          onHover={onHover}
          still={still}
          compact={compact}
        />
      ))}
      <Rig still={still} height={height} />
    </Canvas>
  );
}

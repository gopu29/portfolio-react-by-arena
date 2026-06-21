import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type CursorState = {
  x: number;
  y: number;
};

type WorkspaceSceneProps = {
  cursor: CursorState;
  active?: boolean;
  mode?: "hero" | "footer";
  className?: string;
};

function FloatingParticle({
  index,
  color,
}: {
  index: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  const base = useMemo(
    () => ({
      x: (index % 4) * 1.4 - 2.2,
      y: Math.floor(index / 4) * 0.65 + 0.2,
      z: (index % 2 === 0 ? -1 : 1) * (1.4 + (index % 3) * 0.2),
      speed: 0.45 + index * 0.05,
    }),
    [index]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * base.speed;
    ref.current.position.x = base.x + Math.sin(t + index) * 0.18;
    ref.current.position.y = base.y + Math.cos(t * 1.2 + index) * 0.16;
    ref.current.position.z = base.z + Math.sin(t * 1.5) * 0.2;
    ref.current.scale.setScalar(0.8 + Math.sin(t * 2.2) * 0.08);
  });

  return (
    <mesh ref={ref} position={[base.x, base.y, base.z]}>
      <icosahedronGeometry args={[0.06, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

function WorkspaceModel({
  cursor,
  active,
  mode,
  hovered,
}: {
  cursor: CursorState;
  active: boolean;
  mode: "hero" | "footer";
  hovered: boolean;
}) {
  const root = useRef<THREE.Group>(null!);
  const head = useRef<THREE.Group>(null!);
  const leftArm = useRef<THREE.Group>(null!);
  const rightArm = useRef<THREE.Group>(null!);
  const mug = useRef<THREE.Group>(null!);
  const laptopScreen = useRef<THREE.MeshStandardMaterial>(null!);
  const monitorScreen = useRef<THREE.MeshStandardMaterial>(null!);
  const phoneScreen = useRef<THREE.MeshStandardMaterial>(null!);
  const lampBulb = useRef<THREE.MeshStandardMaterial>(null!);
  const codeBars = useRef<THREE.Mesh[]>([]);
  const deskGlow = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const hoverBoost = hovered ? 1 : 0;
    const liveBoost = active ? 1 : 0.5;
    const sip = Math.pow(Math.max(0, Math.sin(t * 0.45 - 0.7)), 12);
    const type = Math.sin(t * 8.2) * 0.12 * (0.65 + liveBoost * 0.4);
    const look = Math.sin(t * 0.75) * 0.18;

    root.current.rotation.y = THREE.MathUtils.lerp(
      root.current.rotation.y,
      cursor.x * 0.35 + hoverBoost * 0.08,
      0.06
    );
    root.current.rotation.x = THREE.MathUtils.lerp(
      root.current.rotation.x,
      -cursor.y * 0.12,
      0.05
    );
    root.current.position.y = THREE.MathUtils.lerp(
      root.current.position.y,
      mode === "hero" ? -0.92 : -1.06 + Math.sin(t * 1.2) * 0.04,
      0.08
    );

    head.current.rotation.y = THREE.MathUtils.lerp(
      head.current.rotation.y,
      look + cursor.x * 0.24 + hoverBoost * 0.1,
      0.12
    );
    head.current.rotation.x = THREE.MathUtils.lerp(
      head.current.rotation.x,
      -0.08 + cursor.y * 0.2 - sip * 0.6,
      0.12
    );

    leftArm.current.rotation.x = THREE.MathUtils.lerp(
      leftArm.current.rotation.x,
      -1.1 + type,
      0.18
    );
    rightArm.current.rotation.x = THREE.MathUtils.lerp(
      rightArm.current.rotation.x,
      -1.02 - type - sip * 1.2,
      0.18
    );
    rightArm.current.rotation.z = THREE.MathUtils.lerp(
      rightArm.current.rotation.z,
      -0.22 - sip * 0.8,
      0.18
    );

    mug.current.position.x = THREE.MathUtils.lerp(
      mug.current.position.x,
      0.8 + sip * -0.35,
      0.14
    );
    mug.current.position.y = THREE.MathUtils.lerp(
      mug.current.position.y,
      0.36 + sip * 0.72,
      0.14
    );
    mug.current.position.z = THREE.MathUtils.lerp(
      mug.current.position.z,
      0.24 + sip * 0.38,
      0.14
    );
    mug.current.rotation.z = THREE.MathUtils.lerp(
      mug.current.rotation.z,
      -sip * 0.6,
      0.14
    );

    laptopScreen.current.emissiveIntensity =
      1.2 + Math.sin(t * 3.4) * 0.22 + hoverBoost * 0.15;
    monitorScreen.current.emissiveIntensity =
      1.45 + Math.cos(t * 2.4) * 0.22 + liveBoost * 0.22;
    phoneScreen.current.emissiveIntensity = 1.2 + Math.sin(t * 5.4) * 0.14;
    lampBulb.current.emissiveIntensity = 1.6 + Math.sin(t * 2) * 0.18 + hoverBoost * 0.1;
    deskGlow.current.emissiveIntensity = 0.18 + liveBoost * 0.08;

    codeBars.current.forEach((bar, index) => {
      if (!bar) return;
      bar.scale.x = 0.7 + Math.sin(t * 2.8 + index * 0.7) * 0.35;
      bar.position.x = -0.58 + index * 0.22 + Math.sin(t * 1.5 + index) * 0.03;
      bar.position.y = 0.82 - index * 0.16 + Math.cos(t * 2 + index) * 0.015;
      bar.rotation.z += delta * 0.02;
    });
  });

  return (
    <group ref={root} scale={mode === "hero" ? 1 : 1.05}>
      <mesh position={[0, -0.56, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.25, 64]} />
        <meshStandardMaterial color="#08111f" metalness={0.15} roughness={0.85} />
      </mesh>

      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.16, 1.3]} />
        <meshStandardMaterial
          ref={deskGlow}
          color="#0d1528"
          emissive="#0f172f"
          metalness={0.22}
          roughness={0.42}
        />
      </mesh>

      <mesh position={[0, -0.32, -0.45]} castShadow>
        <boxGeometry args={[0.14, 0.95, 0.14]} />
        <meshStandardMaterial color="#0a1020" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-1.08, -0.28, 0.42]} castShadow>
        <boxGeometry args={[0.1, 0.88, 0.1]} />
        <meshStandardMaterial color="#0a1020" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[1.08, -0.28, 0.42]} castShadow>
        <boxGeometry args={[0.1, 0.88, 0.1]} />
        <meshStandardMaterial color="#0a1020" metalness={0.5} roughness={0.4} />
      </mesh>

      <group position={[-0.26, 0.44, -0.06]}>
        <mesh castShadow>
          <boxGeometry args={[0.82, 0.06, 0.58]} />
          <meshStandardMaterial color="#111c31" metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.26, -0.18]} rotation={[-0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.82, 0.52, 0.04]} />
          <meshStandardMaterial
            ref={laptopScreen}
            color="#7dd3fc"
            emissive="#38bdf8"
            metalness={0.18}
            roughness={0.18}
          />
        </mesh>
      </group>

      <group position={[0.84, 0.49, -0.22]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.42, 24]} />
          <meshStandardMaterial color="#111c31" metalness={0.45} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.06, 0]} castShadow>
          <boxGeometry args={[0.88, 0.52, 0.05]} />
          <meshStandardMaterial
            ref={monitorScreen}
            color="#a78bfa"
            emissive="#8b5cf6"
            metalness={0.18}
            roughness={0.16}
          />
        </mesh>
      </group>

      <group ref={mug} position={[0.8, 0.36, 0.24]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.085, 0.16, 24]} />
          <meshStandardMaterial color="#eef2ff" metalness={0.1} roughness={0.2} />
        </mesh>
        <mesh position={[0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.045, 0.01, 12, 24]} />
          <meshStandardMaterial color="#dbeafe" metalness={0.2} roughness={0.22} />
        </mesh>
      </group>

      <group position={[1.08, 0.3, 0.44]}>
        <mesh castShadow>
          <boxGeometry args={[0.14, 0.025, 0.28]} />
          <meshStandardMaterial color="#0f172a" metalness={0.35} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0.02, -0.01]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.12, 0.01, 0.22]} />
          <meshStandardMaterial
            ref={phoneScreen}
            color="#67e8f9"
            emissive="#22d3ee"
            metalness={0.12}
            roughness={0.12}
          />
        </mesh>
      </group>

      <group position={[-0.96, 0.31, 0.34]}>
        {Array.from({ length: 7 }).map((_, index) => (
          <mesh key={index} position={[-0.24 + index * 0.08, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.022, 0.16]} />
            <meshStandardMaterial color="#1e293b" metalness={0.35} roughness={0.3} />
          </mesh>
        ))}
        {Array.from({ length: 4 }).map((_, row) => (
          <mesh key={`row-${row}`} position={[0.16, 0, -0.1 + row * 0.07]} castShadow>
            <boxGeometry args={[0.05, 0.022, 0.05]} />
            <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      <group position={[1.24, 0.62, -0.02]}>
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 18]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[-0.18, 0.74, 0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.46, 0.03, 0.03]} />
          <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[-0.4, 0.67, 0.02]} rotation={[0.12, 0, 0.32]} castShadow>
          <coneGeometry args={[0.12, 0.22, 32]} />
          <meshStandardMaterial color="#111827" metalness={0.28} roughness={0.22} />
        </mesh>
        <mesh position={[-0.46, 0.61, 0.06]}>
          <sphereGeometry args={[0.06, 24, 24]} />
          <meshStandardMaterial
            ref={lampBulb}
            color="#fef3c7"
            emissive="#fde68a"
            emissiveIntensity={1.5}
            roughness={0.1}
          />
        </mesh>
      </group>

      <group position={[-1.22, 0.42, -0.08]} rotation={[0.12, 0.28, 0.18]}>
        <mesh castShadow>
          <torusGeometry args={[0.13, 0.025, 16, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh position={[0.1, -0.06, 0]} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.05]} />
          <meshStandardMaterial color="#1e293b" metalness={0.35} roughness={0.2} />
        </mesh>
        <mesh position={[-0.1, -0.06, 0]} castShadow>
          <boxGeometry args={[0.08, 0.12, 0.05]} />
          <meshStandardMaterial color="#1e293b" metalness={0.35} roughness={0.2} />
        </mesh>
      </group>

      <group position={[-0.14, 0.5, 0.16]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#f8d4bf" roughness={0.5} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0.43, 0.17]}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[-0.07, 0.44, 0.18]}>
          <sphereGeometry args={[0.018, 12, 12]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        <mesh position={[0, 0.09, 0]} castShadow>
          <capsuleGeometry args={[0.25, 0.4, 8, 16]} />
          <meshStandardMaterial color="#111827" metalness={0.18} roughness={0.55} />
        </mesh>
        <mesh position={[0, -0.28, 0.02]} castShadow>
          <boxGeometry args={[0.34, 0.18, 0.24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.6} />
        </mesh>

        <group ref={head} position={[0, 0.42, 0]} />

        <group ref={leftArm} position={[-0.23, 0.16, 0.02]}>
          <mesh position={[0, -0.18, 0.1]} rotation={[0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.34, 8, 12]} />
            <meshStandardMaterial color="#f6c8ad" roughness={0.5} />
          </mesh>
        </group>
        <group ref={rightArm} position={[0.23, 0.16, 0.02]}>
          <mesh position={[0, -0.18, 0.1]} rotation={[0.5, 0, 0]} castShadow>
            <capsuleGeometry args={[0.05, 0.34, 8, 12]} />
            <meshStandardMaterial color="#f6c8ad" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {Array.from({ length: 6 }).map((_, index) => (
          <mesh
          key={index}
          ref={(element: THREE.Mesh | null) => {
            if (element) codeBars.current[index] = element;
          }}
          position={[-0.58 + index * 0.22, 0.82 - index * 0.16, -0.36]}
        >
          <boxGeometry args={[0.3, 0.04, 0.012]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#22d3ee" : "#8b5cf6"}
            emissive={index % 2 === 0 ? "#22d3ee" : "#8b5cf6"}
            emissiveIntensity={1.3}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      <mesh position={[0.84, 0.08, -0.16]}>
        <boxGeometry args={[0.66, 0.02, 0.02]} />
        <meshStandardMaterial color="#64748b" emissive="#94a3b8" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

export default function WorkspaceScene({
  cursor,
  active = true,
  mode = "hero",
  className,
}: WorkspaceSceneProps) {
  const [hovered, setHovered] = useState(false);
  const particleColors = ["#22d3ee", "#8b5cf6", "#38bdf8", "#f472b6", "#a78bfa", "#2dd4bf"];

  return (
    <div
      className={className}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.55, 5.4], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight
          position={[3, 5, 2]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-2.5, 2.4, 2]} intensity={1.5} color="#22d3ee" />
        <pointLight position={[2.7, 1.8, -1]} intensity={1.7} color="#8b5cf6" />
        <spotLight position={[0, 4, 3]} angle={0.32} penumbra={0.75} intensity={1.8} color="#f8fafc" />
        <fog attach="fog" args={["#050816", 5.5, 9.5]} />

        <WorkspaceModel cursor={cursor} active={active} mode={mode} hovered={hovered} />

        {Array.from({ length: 8 }).map((_, index) => (
          <FloatingParticle
            key={index}
            index={index}
            color={particleColors[index % particleColors.length]}
          />
        ))}
      </Canvas>
    </div>
  );
}

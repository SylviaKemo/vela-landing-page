"use client";

import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { Box3, MathUtils, Vector3, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { INITIAL_POSE, type DressPose } from "./dressPose";

const MODEL_URL = "/models/ivory-cascade.glb";

/** Share of the canvas height the dress fills (head to hem). */
const FILL = 0.84;
/**
 * Share of the canvas width the dress may span. On narrow (portrait) screens the
 * width is the limit, so let the widest point of the skirt run slightly past the
 * edges rather than leave large empty bands above and below the dress.
 */
const WIDTH_FILL = { landscape: 0.84, portrait: 1.12 };
/** Nudge down (share of canvas height) so the top clears the fixed header and logo. */
const DROP = 0.065;

type DressCanvasProps = { pose: RefObject<DressPose> };

export default function DressCanvas({ pose }: DressCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 30, position: [0, 0, 4.5], near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2.5, 3, 4]} intensity={1.5} />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.5} />
      {/* Local studio reflections, no network HDR */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[0, 4, 3]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1} position={[-4, 0, 2]} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={1} position={[4, 0, 2]} scale={[2, 6, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Dress pose={pose} />
      </Suspense>
    </Canvas>
  );
}

function Dress({ pose }: DressCanvasProps) {
  const { scene } = useGLTF(MODEL_URL);
  const group = useRef<Group>(null);
  const viewport = useThree((s) => s.viewport);

  // Model bounds: used to centre it and to fit it to the canvas height.
  const bounds = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    // It turns on its vertical axis, so the widest it ever gets is max(width, depth).
    return { height: size.y, width: Math.max(size.x, size.z), center };
  }, [scene]);

  // Fit the whole dress to the canvas height, unless the screen is too narrow for that.
  const widthFill = viewport.width < viewport.height ? WIDTH_FILL.portrait : WIDTH_FILL.landscape;
  const fit = Math.min((viewport.height * FILL) / bounds.height, (viewport.width * widthFill) / bounds.width);

  // Matte ceramic look: the scan ships with metalness 1, which renders dark without an HDR.
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as MeshStandardMaterial;
      mat.metalness = 0;
      mat.metalnessMap = null;
      mat.roughness = 0.85;
      mat.envMapIntensity = 0.6;
      mat.needsUpdate = true;
    });
  }, [scene]);

  useFrame((_, dt) => {
    const g = group.current;
    const p = pose.current;
    if (!g || !p) return;
    g.rotation.y = MathUtils.damp(g.rotation.y, p.rotY, 8, dt);
  });

  return (
    <group scale={fit} position={[0, -viewport.height * DROP, 0]}>
      <group ref={group} rotation={[0, INITIAL_POSE.rotY, 0]}>
        <primitive object={scene} position={[-bounds.center.x, -bounds.center.y, -bounds.center.z]} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_URL);

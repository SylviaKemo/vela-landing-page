"use client";

import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Box3, Color, MathUtils, Vector3, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { INITIAL_POSE, type DressPose } from "./dressPose";

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

type DressCanvasProps = {
  pose: RefObject<DressPose>;
  /** Model to show (GLB path). */
  url: string;
  /** Every model on offer: the others are fetched in the background once the first is up. */
  urls: string[];
  /** Tint multiplied over the scan's own texture (hex). */
  color: string;
  /** Render frames only while the section is on (or near) screen. */
  active: boolean;
  /** Called if the browser drops the WebGL context (e.g. GPU memory pressure). */
  onContextLost: () => void;
};

export default function DressCanvas({ pose, url, urls, color, active, onContextLost }: DressCanvasProps) {
  const [shown, setShown] = useState<string | null>(null);

  // Once the current model is on screen, fetch the others so switching is instant.
  useEffect(() => {
    if (!active || shown !== url) return;
    for (const u of urls) if (u !== url) useGLTF.preload(u);
  }, [active, shown, url, urls]);

  return (
    <Canvas
      // 1.5x max: Retina screens would otherwise render 4x the pixels of a 1x screen.
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 30, position: [0, 0, 4.5], near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: "default" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost();
        });
      }}
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
      <Turntable pose={pose}>
        {/* While a newly picked model downloads, keep showing the previous one. */}
        <Suspense fallback={shown ? <DressModel url={shown} color={color} /> : null}>
          <DressModel url={url} color={color} onReady={setShown} />
        </Suspense>
      </Turntable>
    </Canvas>
  );
}

/** Turns with the scroll. Shared by every model so switching keeps the angle. */
function Turntable({ pose, children }: { pose: RefObject<DressPose>; children: ReactNode }) {
  const group = useRef<Group>(null);
  useFrame((_, dt) => {
    const g = group.current;
    const p = pose.current;
    if (!g || !p) return;
    g.rotation.y = MathUtils.damp(g.rotation.y, p.rotY, 8, dt);
  });
  return (
    <group ref={group} rotation={[0, INITIAL_POSE.rotY, 0]}>
      {children}
    </group>
  );
}

type DressModelProps = { url: string; color: string; onReady?: (url: string) => void };

function DressModel({ url, color, onReady }: DressModelProps) {
  const { scene } = useGLTF(url);
  const settle = useRef<Group>(null);
  const viewport = useThree((s) => s.viewport);
  const target = useMemo(() => new Color(color), [color]);
  const colorRef = useRef(target);

  useEffect(() => {
    colorRef.current = target;
  }, [target]);

  const materials = useMemo(() => {
    const list: MeshStandardMaterial[] = [];
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) list.push(mesh.material as MeshStandardMaterial);
    });
    return list;
  }, [scene]);

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

  // Matte ceramic look: the scans ship with metalness 1, which renders dark without an HDR.
  // A newly shown model starts in the current colour rather than fading in from white.
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as MeshStandardMaterial;
      mat.metalness = 0;
      mat.metalnessMap = null;
      mat.roughness = 0.85;
      mat.envMapIntensity = 0.6;
      mat.color.copy(colorRef.current);
      mat.needsUpdate = true;
    });
  }, [scene]);

  useEffect(() => {
    onReady?.(url);
  }, [onReady, url]);

  useFrame((_, dt) => {
    // Ease towards the chosen colour rather than snapping.
    const k = 1 - Math.exp(-6 * dt);
    for (const mat of materials) mat.color.lerp(target, k);
    // A newly shown model settles from slightly smaller to full size.
    const g = settle.current;
    if (g) g.scale.setScalar(MathUtils.damp(g.scale.x, 1, 7, dt));
  });

  return (
    <group scale={fit} position={[0, -viewport.height * DROP, 0]}>
      <group ref={settle} scale={0.94}>
        <primitive object={scene} position={[-bounds.center.x, -bounds.center.y, -bounds.center.z]} />
      </group>
    </group>
  );
}

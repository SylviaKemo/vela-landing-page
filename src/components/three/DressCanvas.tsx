"use client";

import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import { Box3, Color, MathUtils, Matrix4, Vector3, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { INITIAL_POSE, type DressPose } from "./dressPose";

const CAMERA_Z = 4.5;
const FOV = 30;
const TAN_HALF_FOV = Math.tan(MathUtils.degToRad(FOV / 2));

/**
 * Space to keep clear around the dress, as shares of the canvas height (top,
 * bottom) and of half its width (side = how far out the skirt may reach).
 * Top clears the fixed header logo; on phones the bottom clears the pickers.
 */
const FRAME = {
  landscape: { top: 0.11, bottom: 0.035, side: 0.8 },
  portrait: { top: 0.1, bottom: 0.2, side: 1 },
};

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
      camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 50 }}
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
    g.rotation.y = MathUtils.damp(g.rotation.y, p.rotY + p.userY, 8, dt);
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
  const size = useThree((s) => s.size);
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

  // Model shape, in the scene's own coordinates: its centre, height, and how far
  // the skirt reaches from the vertical axis it turns on.
  const shape = useMemo(() => {
    scene.updateWorldMatrix(true, true);
    const toLocal = new Matrix4().copy(scene.matrixWorld).invert();
    const m = new Matrix4();
    const v = new Vector3();
    const box = new Box3();
    const points: Vector3[] = [];
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      m.multiplyMatrices(toLocal, mesh.matrixWorld);
      const pos = mesh.geometry.attributes.position;
      // Every 4th vertex is plenty for the outline of a dense scan.
      for (let i = 0; i < pos.count; i += 4) {
        v.fromBufferAttribute(pos, i).applyMatrix4(m);
        box.expandByPoint(v);
        points.push(v.clone());
      }
    });
    const center = box.getCenter(new Vector3());
    let radius = 0;
    for (const p of points) radius = Math.max(radius, Math.hypot(p.x - center.x, p.z - center.z));
    return { center, height: box.max.y - box.min.y, radius };
  }, [scene]);

  // Fit the whole dress, head to hem, at every angle. With perspective, the parts of
  // the hem turned towards the camera look bigger and lower, so the bottom edge is
  // checked with the hem at its full radius in front; the sides likewise.
  const aspect = size.width / Math.max(1, size.height);
  const frame = aspect < 1 ? FRAME.portrait : FRAME.landscape;
  const tTop = TAN_HALF_FOV * (1 - 2 * frame.top);
  const tBottom = TAN_HALF_FOV * (1 - 2 * frame.bottom);
  const tSide = TAN_HALF_FOV * aspect * frame.side;
  const { height: h, radius: r } = shape;
  const fitHeight = (CAMERA_Z * (tTop + tBottom)) / (h + tBottom * r);
  const fitWidth = (tSide * CAMERA_Z) / (r * (1 + tSide));
  const fit = Math.min(fitHeight, fitWidth);
  // Vertical position: top flush with its line, or, if width is the limit, centred in the band.
  const yTopAligned = tTop * CAMERA_Z - (fit * h) / 2;
  const yBottomAligned = (fit * h) / 2 - tBottom * (CAMERA_Z - fit * r);
  const y = (yTopAligned + yBottomAligned) / 2;

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
    <group scale={fit} position={[0, y, 0]}>
      <group ref={settle} scale={0.94}>
        <primitive object={scene} position={[-shape.center.x, -shape.center.y, -shape.center.z]} />
      </group>
    </group>
  );
}

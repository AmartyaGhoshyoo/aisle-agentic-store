// Aisle's products as realistic glTF models (free licences — see MODEL_CREDITS), loaded once,
// centred and scaled to ~2 units, then cloned wherever they appear (turntable, bag, photos).
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type ModelId = "p1" | "p2" | "p3" | "p5" | "p7" | "p9";
export const MODEL_IDS: ModelId[] = ["p1", "p2", "p3", "p5", "p7", "p9"];

// Per-model file and the turn that shows its best side to a camera on +z.
// `size` is the longest side in scene units, so products keep believable proportions.
const FILES: Record<ModelId, { url: string; size: number; rotY: number; rotX?: number }> = {
  p1: { url: "/models/sneaker.glb", size: 2, rotY: 0 },
  p2: { url: "/models/speaker.glb", size: 1.5, rotY: 0 },
  p3: { url: "/models/watch.glb", size: 1.15, rotY: 0 },
  p5: { url: "/models/sunglasses.glb", size: 1.5, rotY: 0 },
  p7: { url: "/models/suitcase.glb", size: 2, rotY: 0 },
  p9: { url: "/models/bottle.glb", size: 1.45, rotY: 0 },
};

export const MODEL_CREDITS = [
  "Sneaker: “Materials Variants Shoe” © Shopify, CC BY 4.0",
  "Watch: “Chronograph Watch” © Darmstadt Graphics Group, CC BY 4.0 (from “Chronograph Watch Mudmaster” by graphiccompressor)",
  "Sunglasses: “Sunglasses Khronos” © Darmstadt Graphics Group, CC BY 4.0",
  "Speaker & bottle: Microsoft glTF samples, CC0",
  "Suitcase: Poly Haven “Vintage Suitcase”, CC0",
];

const loader = new GLTFLoader();
const cache = new Map<ModelId, Promise<THREE.Group>>();

function loadBase(id: ModelId) {
  let p = cache.get(id);
  if (!p) {
    p = loader.loadAsync(FILES[id].url).then((gltf) => {
      const root = gltf.scene;
      root.rotation.set(FILES[id].rotX ?? 0, FILES[id].rotY, 0);
      root.updateMatrixWorld(true);
      // Centre on the origin and scale the longest side to `size`.
      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      root.position.sub(box.getCenter(new THREE.Vector3()));
      const inner = new THREE.Group();
      inner.add(root);
      inner.scale.setScalar(FILES[id].size / Math.max(size.x, size.y, size.z));
      const wrap = new THREE.Group();
      wrap.add(inner);
      return wrap;
    });
    cache.set(id, p);
  }
  return p;
}

/** A fresh copy of a product model (geometry and materials shared with the cache). */
export async function loadProduct(id: ModelId) {
  return (await loadBase(id)).clone(true);
}

/** Soft studio reflections, generated procedurally (no HDR download). */
export function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return env;
}

export function studioLights(scene: THREE.Scene) {
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xf9a8d4, 1.4);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
}

/** Free geometries/materials a scene created itself (never the shared model cache). */
export function disposeOwned(objects: THREE.Object3D[]) {
  objects.forEach((g) =>
    g.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    }),
  );
}

// ── Product "photos": each model rendered once to a transparent PNG ─────────
let shots: Promise<Record<ModelId, string>> | null = null;

export function productShots(): Promise<Record<ModelId, string>> {
  if (shots) return shots;
  shots = (async () => {
    const models = await Promise.all(MODEL_IDS.map(loadProduct));
    const size = 640;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(size, size, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const scene = new THREE.Scene();
    scene.environment = studioEnvironment(renderer);
    studioLights(scene);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    const out = {} as Record<ModelId, string>;
    MODEL_IDS.forEach((id, i) => {
      const g = models[i]!;
      g.rotation.set(0.12, 0.5, 0);
      scene.add(g);
      // Frame each product to fill the picture, whatever its size.
      const r = new THREE.Box3().setFromObject(g).getBoundingSphere(new THREE.Sphere()).radius;
      camera.position.set(0, r * 0.45, r * 3.6);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      out[id] = renderer.domElement.toDataURL("image/png");
      scene.remove(g);
    });
    scene.environment?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    return out;
  })();
  return shots;
}

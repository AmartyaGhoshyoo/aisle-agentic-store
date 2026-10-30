// Aisle's products, modelled in code with three.js (no downloaded models or photos).
// Each builder returns a Group roughly 2 units across, centred on the origin, facing +z.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type ModelId = "p1" | "p2" | "p3" | "p5" | "p7" | "p9";
export const MODEL_IDS: ModelId[] = ["p1", "p2", "p3", "p5", "p7", "p9"];

const phys = (p: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial({ roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.25, ...p });

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

function sneaker() {
  const g = new THREE.Group();
  // Side profile of the upper: toe on the right, heel on the left.
  const up = new THREE.Shape();
  up.moveTo(-1.0, 0.14);
  up.bezierCurveTo(-1.06, 0.36, -1.02, 0.6, -0.9, 0.72);
  up.bezierCurveTo(-0.78, 0.8, -0.62, 0.66, -0.48, 0.6);
  up.bezierCurveTo(-0.36, 0.62, -0.26, 0.8, -0.14, 0.78);
  up.bezierCurveTo(0.1, 0.66, 0.38, 0.52, 0.68, 0.44);
  up.bezierCurveTo(0.96, 0.38, 1.08, 0.26, 1.02, 0.14);
  up.closePath();
  const upper = new THREE.Mesh(
    new THREE.ExtrudeGeometry(up, { depth: 0.62, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.08, bevelSegments: 6, curveSegments: 24 }),
    phys({ color: 0xe23d7a, roughness: 0.55, sheen: 1, sheenColor: new THREE.Color(0xffc2dc) }),
  );
  upper.position.z = -0.31;
  g.add(upper);
  const so = new THREE.Shape();
  so.moveTo(-1.08, 0);
  so.lineTo(1.04, 0);
  so.bezierCurveTo(1.16, 0.0, 1.16, 0.16, 1.06, 0.18);
  so.lineTo(-1.08, 0.18);
  so.closePath();
  const sole = new THREE.Mesh(new THREE.ExtrudeGeometry(so, { depth: 0.78, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4 }), phys({ color: 0xfaf7f2, roughness: 0.7 }));
  sole.position.z = -0.39;
  g.add(sole);
  // Swoosh-like stripe
  const st = new THREE.Shape();
  st.moveTo(-0.55, 0.3);
  st.bezierCurveTo(-0.1, 0.18, 0.4, 0.26, 0.8, 0.42);
  st.bezierCurveTo(0.35, 0.34, -0.1, 0.3, -0.55, 0.38);
  const stripe = new THREE.Mesh(new THREE.ShapeGeometry(st), phys({ color: 0xfaf7f2, side: THREE.DoubleSide }));
  stripe.position.z = 0.44;
  g.add(stripe);
  const lacesMat = phys({ color: 0xffffff, roughness: 0.8 });
  for (let i = 0; i < 5; i++) {
    const lace = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.5, 4, 8), lacesMat);
    lace.rotation.x = Math.PI / 2;
    lace.position.set(-0.08 + i * 0.13, 0.76 - i * 0.055, 0);
    g.add(lace);
  }
  // Ankle opening and a heel tab
  const collar = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 12), phys({ color: 0x3b0d24, roughness: 0.9 }));
  collar.scale.set(1.1, 0.25, 0.75);
  collar.position.set(-0.62, 0.7, 0);
  g.add(collar);
  const tab = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.3), phys({ color: 0xfaf7f2 }));
  tab.position.set(-1.05, 0.62, 0);
  g.add(tab);
  g.position.y = -0.35;
  return g;
}

function headphones() {
  const g = new THREE.Group();
  const dark = phys({ color: 0x2a2633, roughness: 0.35, metalness: 0.2 });
  const accent = phys({ color: 0xbe185d, roughness: 0.3, metalness: 0.4 });
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.075, 20, 80, Math.PI), dark);
  band.position.y = 0.05;
  g.add(band);
  const pad = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.09, 16, 40, Math.PI * 0.5), phys({ color: 0x3b3646, roughness: 0.9 }));
  pad.rotation.z = Math.PI / 4;
  pad.position.y = 0.05;
  g.add(pad);
  [-1, 1].forEach((s) => {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 48), dark);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(s * 0.8, -0.18, 0);
    g.add(cup);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 12, 48), accent);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(s * 0.93, -0.18, 0);
    g.add(ring);
    const cushion = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.08, 16, 40), phys({ color: 0x48414f, roughness: 0.95 }));
    cushion.rotation.y = Math.PI / 2;
    cushion.position.set(s * 0.66, -0.18, 0);
    g.add(cushion);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.12), accent);
    arm.position.set(s * 0.8, 0.08, 0);
    g.add(arm);
  });
  g.rotation.y = -0.5;
  return g;
}

function watch() {
  const g = new THREE.Group();
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xe6e6ea, metalness: 1, roughness: 0.18 });
  const strap = phys({ color: 0x0f9e74, roughness: 0.6 });
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.15, 16, 80), strap);
  band.scale.set(1, 1.18, 0.55);
  band.rotation.y = Math.PI / 2;
  g.add(band);
  const holder = new THREE.Group();
  holder.position.set(0, 0, 0.62);
  const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.2, 64), steel);
  c2.rotation.x = Math.PI / 2;
  holder.add(c2);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.37, 64), new THREE.MeshPhysicalMaterial({ color: 0x14231f, roughness: 0.2, clearcoat: 1 }));
  face.position.z = 0.101;
  holder.add(face);
  for (let i = 0; i < 12; i++) {
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.02, i % 3 ? 0.04 : 0.08, 0.01), steel);
    const a = (i / 12) * Math.PI * 2;
    tick.position.set(Math.sin(a) * 0.31, Math.cos(a) * 0.31, 0.105);
    tick.rotation.z = -a;
    holder.add(tick);
  }
  const hand = (len: number, rot: number, col: number) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.025, len, 0.01), new THREE.MeshBasicMaterial({ color: col }));
    h.geometry.translate(0, len / 2, 0);
    h.position.z = 0.11;
    h.rotation.z = rot;
    holder.add(h);
  };
  hand(0.22, -1.1, 0xffffff);
  hand(0.3, 2.2, 0xffffff);
  hand(0.32, 0.6, 0xf472b6);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16), steel);
  crown.rotation.z = Math.PI / 2;
  crown.position.set(0.48, 0, 0);
  holder.add(crown);
  g.add(holder);
  g.rotation.y = 0.3;
  g.rotation.x = -0.15;
  return g;
}

function sunglasses() {
  const g = new THREE.Group();
  const frame = phys({ color: 0x1b1b22, roughness: 0.2, metalness: 0.3 });
  const lens = new THREE.MeshPhysicalMaterial({ color: 0x6d28d9, metalness: 0.3, roughness: 0.05, transparent: true, opacity: 0.88, iridescence: 1, iridescenceIOR: 1.6, clearcoat: 1, side: THREE.DoubleSide });
  [-1, 1].forEach((s) => {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.055, 16, 64), frame);
    rim.scale.y = 0.82;
    rim.position.x = s * 0.5;
    g.add(rim);
    const l = new THREE.Mesh(new THREE.CircleGeometry(0.39, 64), lens);
    l.scale.y = 0.82;
    l.position.set(s * 0.5, 0, 0.005);
    g.add(l);
    const temple = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 1.2), frame);
    temple.position.set(s * 0.9, 0.12, -0.58);
    g.add(temple);
  });
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.04, 12, 24, Math.PI), frame);
  bridge.position.y = 0.12;
  g.add(bridge);
  g.rotation.y = -0.35;
  return g;
}

function tote() {
  const g = new THREE.Group();
  const leather = phys({ color: 0x0f8f68, roughness: 0.5, clearcoat: 0.4, sheen: 0.6, sheenColor: new THREE.Color(0x6ee7b7) });
  const trap = new THREE.Shape();
  trap.moveTo(-0.62, -0.55);
  trap.lineTo(0.62, -0.55);
  trap.lineTo(0.78, 0.5);
  trap.lineTo(-0.78, 0.5);
  trap.closePath();
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(trap, { depth: 0.36, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 6 }), leather);
  body.position.z = -0.18;
  g.add(body);
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xe8c47a, metalness: 1, roughness: 0.25 });
  [-0.33, 0.33].forEach((x) => {
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.045, 12, 40, Math.PI), leather);
    handle.position.set(x, 0.55, 0);
    g.add(handle);
    [-0.26, 0.26].forEach((dx) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 8, 20), gold);
      ring.position.set(x + dx, 0.56, 0.08);
      g.add(ring);
    });
  });
  const badge = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.02), gold);
  badge.position.set(0, 0.1, 0.27);
  g.add(badge);
  g.rotation.y = -0.4;
  return g;
}

function perfume() {
  const g = new THREE.Group();
  const glass = new THREE.MeshPhysicalMaterial({ color: 0xffd6e8, metalness: 0, roughness: 0.04, transmission: 0.95, thickness: 0.6, ior: 1.5, clearcoat: 1, transparent: true });
  const bottle = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(1.0, 1.2, 0.18), { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 8 }), glass);
  bottle.position.set(0, -0.2, -0.25);
  g.add(bottle);
  const liquid = new THREE.Mesh(new THREE.ExtrudeGeometry(roundedRect(0.82, 0.85, 0.14), { depth: 0.36, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 4 }), phys({ color: 0xdb2777, roughness: 0.1, transmission: 0.3, transparent: true, opacity: 0.92 }));
  liquid.position.set(0, -0.37, -0.18);
  g.add(liquid);
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xe8c47a, metalness: 1, roughness: 0.2 });
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.14, 32), gold);
  neck.position.y = 0.55;
  g.add(neck);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.42, 6), phys({ color: 0x2a0f1f, roughness: 0.15, clearcoat: 1 }));
  cap.position.y = 0.82;
  g.add(cap);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.18), new THREE.MeshPhysicalMaterial({ color: 0xfdf2f8, roughness: 0.6 }));
  label.position.set(0, -0.2, 0.36);
  g.add(label);
  g.rotation.y = 0.35;
  return g;
}

const BUILDERS: Record<ModelId, () => THREE.Group> = { p1: sneaker, p2: headphones, p3: watch, p5: sunglasses, p7: tote, p9: perfume };

export function buildProduct(id: ModelId) {
  return BUILDERS[id]();
}

/** Soft reflections for glossy materials, generated procedurally (no HDR file). */
export function studioEnvironment(renderer: THREE.WebGLRenderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  return env;
}

export function studioLights(scene: THREE.Scene) {
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xf9a8d4, 1.6);
  rim.position.set(-4, 2, -3);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
}

/** Free a group's geometries and materials. */
export function disposeGroup(g: THREE.Object3D) {
  g.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
    else mat?.dispose();
  });
}

// ── Product "photos": each model rendered once to a transparent PNG ─────────
let shots: Promise<Record<ModelId, string>> | null = null;

export function productShots(): Promise<Record<ModelId, string>> {
  if (shots) return shots;
  shots = new Promise((resolve) => {
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
    for (const id of MODEL_IDS) {
      const g = buildProduct(id);
      g.rotation.y += 0.35;
      scene.add(g);
      const box = new THREE.Box3().setFromObject(g);
      const c = box.getCenter(new THREE.Vector3());
      const r = box.getSize(new THREE.Vector3()).length() / 2;
      camera.position.set(c.x + r * 0.6, c.y + r * 0.9, c.z + r * 3.3);
      camera.lookAt(c);
      renderer.render(scene, camera);
      out[id] = renderer.domElement.toDataURL("image/png");
      scene.remove(g);
      disposeGroup(g);
    }
    scene.environment?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    resolve(out);
  });
  return shots;
}

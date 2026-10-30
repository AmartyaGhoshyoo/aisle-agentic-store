"use client";

// A 3D shopping bag. Products (code-modelled) drop into it one by one as `count` grows,
// and the bag gives a little bounce when each lands.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { disposeOwned, loadProduct, studioEnvironment, studioLights, type ModelId } from "./products";

export default function Bag({ items, count, className = "" }: { items: ModelId[]; count: number; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const countRef = useRef(count);
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const el = host.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.environment = studioEnvironment(renderer);
    studioLights(scene);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.set(0, 2.2, 8.5);
    camera.lookAt(0, 0.75, 0);

    const bag = new THREE.Group();
    scene.add(bag);
    const paper = new THREE.MeshPhysicalMaterial({ color: 0xbe185d, roughness: 0.55, clearcoat: 0.3, side: THREE.DoubleSide });
    const inside = new THREE.MeshStandardMaterial({ color: 0x7a0f3c, roughness: 0.9, side: THREE.DoubleSide });
    const hidden = new THREE.MeshBasicMaterial({ visible: false });
    // Box faces: +x, -x, +y (top, left open), -y, +z, -z
    const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 1.2), [paper, paper, hidden, inside, paper, paper]);
    body.position.y = 0.1;
    bag.add(body);
    const rimGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 0.001, 1.2));
    const rim = new THREE.LineSegments(rimGeo, new THREE.LineBasicMaterial({ color: 0xfbcfe8 }));
    rim.position.y = 1.2;
    bag.add(rim);
    const gold = new THREE.MeshPhysicalMaterial({ color: 0xe8c47a, metalness: 1, roughness: 0.25 });
    [-1, 1].forEach((side) => {
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.04, 12, 40, Math.PI), new THREE.MeshPhysicalMaterial({ color: 0x2a0f1f, roughness: 0.4 }));
      handle.position.set(0, 1.2, side * 0.5);
      bag.add(handle);
    });
    // Logo on the front: "aisle." drawn on a canvas
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const g = c.getContext("2d")!;
    g.fillStyle = "#fdf2f8";
    g.font = "italic 600 120px 'Bodoni Moda', Georgia, serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("aisle.", 256, 128);
    const logoTex = new THREE.CanvasTexture(c);
    logoTex.colorSpace = THREE.SRGBColorSpace;
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: logoTex, transparent: true }));
    logo.position.set(0, 0.15, 0.605);
    bag.add(logo);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), new THREE.MeshBasicMaterial({ color: 0xbe185d, transparent: true, opacity: 0.08 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.0;
    scene.add(floor);

    let disposed = false;
    // Products waiting above the bag
    const slots = [
      { x: -0.6, y: 1.55, z: 0, r: -0.35 },
      { x: 0.6, y: 1.7, z: -0.1, r: 0.35 },
      { x: 0.0, y: 2.05, z: 0.15, r: 0.08 },
    ];
    const drops = items.map((id, i) => {
      const holder = new THREE.Group();
      loadProduct(id).then((m) => !disposed && holder.add(m));
      holder.scale.setScalar(0.75);
      holder.position.set(slots[i]!.x, 6, slots[i]!.z);
      holder.rotation.z = slots[i]!.r;
      holder.visible = false;
      scene.add(holder);
      return { holder, startedAt: -1, landed: false, ...slots[i]! };
    });

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 1 ? 11 : 8.5;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e?.isIntersecting ?? true));
    io.observe(el);

    let frame = 0, squash = 0;
    const clock = new THREE.Clock();
    const draw = () => {
      const t = clock.getElapsedTime();
      const now = performance.now();
      drops.forEach((d, i) => {
        const want = i < countRef.current;
        if (want && d.startedAt < 0) {
          d.startedAt = now;
          d.holder.visible = true;
        }
        if (!want) {
          d.startedAt = -1;
          d.landed = false;
          d.holder.visible = false;
          d.holder.position.y = 6;
          return;
        }
        // Fall with a small bounce (easeOutBounce-ish)
        const k = still ? 1 : Math.min(1, (now - d.startedAt) / 900);
        const bounce = k < 0.7 ? (k / 0.7) ** 2 : 1 - Math.sin(((k - 0.7) / 0.3) * Math.PI) * 0.08;
        d.holder.position.y = 6 + (d.y - 6) * bounce;
        d.holder.rotation.y = (1 - k) * 4 + Math.sin(t * 0.8 + i) * 0.15;
        if (k >= 1 && !d.landed) {
          d.landed = true;
          squash = 1;
        }
      });
      squash *= 0.9;
      bag.scale.set(1 + squash * 0.05, 1 - squash * 0.06, 1 + squash * 0.05);
      bag.rotation.y = still ? -0.35 : -0.35 + Math.sin(t * 0.4) * 0.18;
      renderer.render(scene, camera);
    };
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (visible) draw();
    };
    loop();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      io.disconnect();
      disposed = true;
      disposeOwned([bag, floor]);
      logoTex.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [items]);

  return <div ref={host} aria-hidden="true" className={`[&>canvas]:h-full [&>canvas]:w-full ${className}`} />;
}

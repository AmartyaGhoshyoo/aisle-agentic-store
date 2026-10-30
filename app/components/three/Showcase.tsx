"use client";

// Hero showcase: the six code-modelled products on a glossy turntable. It turns slowly on
// its own; drag (or swipe) to spin it. The product facing you is reported to the page.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SHOWCASE } from "../../data/site";
import { disposeOwned, loadProduct, studioEnvironment, studioLights, type ModelId } from "./products";

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  r.addColorStop(0, "rgba(91,18,56,0.45)");
  r.addColorStop(1, "rgba(91,18,56,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export default function Showcase({ onFront, className = "" }: { onFront: (i: number) => void; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const cb = useRef(onFront);
  useEffect(() => {
    cb.current = onFront;
  }, [onFront]);

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
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);

    // Pedestal: glossy blush disc with a berry light ring.
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 3.75, 0.4, 96),
      new THREE.MeshPhysicalMaterial({ color: 0xfbe4ef, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1 }),
    );
    pedestal.position.y = -1.25;
    scene.add(pedestal);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.68, 0.03, 12, 160), new THREE.MeshBasicMaterial({ color: 0xbe185d }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.04;
    scene.add(ring);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.85, 4.0, 0.25, 96), new THREE.MeshPhysicalMaterial({ color: 0x2a0f1f, roughness: 0.3, clearcoat: 1 }));
    base.position.y = -1.55;
    scene.add(base);

    let disposed = false;
    const owned: THREE.Object3D[] = [pedestal, ring, base];
    const turntable = new THREE.Group();
    scene.add(turntable);
    const shadowTex = shadowTexture();
    const R = 2.75;
    const items = SHOWCASE.map((id, i) => {
      const holder = new THREE.Group();
      const a = (i / SHOWCASE.length) * Math.PI * 2;
      holder.position.set(Math.sin(a) * R, 0, Math.cos(a) * R);
      holder.rotation.y = a;
      const inner = new THREE.Group();
      holder.add(inner);
      const item = { holder, model: inner, minY: -1, a };
      // Load the real model, then remember how far it reaches below its centre so it stands on the disc.
      loadProduct(id as ModelId).then((model) => {
        if (disposed) return;
        // Measure before parenting, so the box is in the model's own space (not world space).
        model.updateMatrixWorld(true);
        item.minY = new THREE.Box3().setFromObject(model).min.y;
        inner.add(model);
      });
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
      sh.rotation.x = -Math.PI / 2;
      sh.position.y = -1.04;
      holder.add(sh);
      turntable.add(holder);
      owned.push(sh);
      return item;
    });

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const far = w / h < 1 ? 15 : 9.2;
      camera.position.set(0, 3.1, far);
      camera.lookAt(0, -0.55, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // Drag to spin with inertia.
    const idleSpin = still ? 0 : 0.18;
    let angle = 0, vel = idleSpin, dragging = false, lastX = 0;
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      angle += dx * 0.008;
      vel = dx * 0.5;
    };
    const up = () => (dragging = false);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e?.isIntersecting ?? true));
    io.observe(el);

    let frame = 0, last = performance.now(), front = -1;
    const clock = new THREE.Clock();
    const draw = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = clock.getElapsedTime();
      if (!dragging) {
        vel += (idleSpin - vel) * 0.02;
        angle += vel * dt;
      }
      turntable.rotation.y = -angle;
      // Which product faces the camera?
      let best = 0, bestZ = -Infinity;
      items.forEach((it, i) => {
        const z = Math.cos(it.a - angle);
        if (z > bestZ) {
          bestZ = z;
          best = i;
        }
        const f = Math.max(0, z);
        const s = 1.05 + f * 0.35;
        it.model.scale.setScalar(s);
        it.model.position.y = -1.04 - it.minY * s; // standing exactly on the disc
        // Cancel the turntable's turn so every product faces the camera, with a gentle sway.
        it.model.rotation.y = angle - it.a + 0.35 + (still ? 0 : Math.sin(t * 0.5 + i) * 0.3);
      });
      if (best !== front) {
        front = best;
        cb.current(best);
      }
      renderer.render(scene, camera);
    };
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (visible) draw();
    };
    if (still) draw();
    else loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      io.disconnect();
      disposed = true;
      disposeOwned(owned);
      shadowTex.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} aria-label="Product showcase — drag to spin" className={`cursor-grab touch-pan-y active:cursor-grabbing [&>canvas]:h-full [&>canvas]:w-full ${className}`} />;
}

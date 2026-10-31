"use client";

// Drag-to-turn 3D product viewer for products that have a real model.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadProduct, studioEnvironment, studioLights, type ModelId } from "../three/products";

export default function Viewer3D({ model, className = "relative" }: { model: ModelId; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = host.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.environment = studioEnvironment(renderer);
    studioLights(scene);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 50);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotateSpeed = 1.6;

    let alive = true;
    loadProduct(model).then((m) => {
      if (!alive) return;
      m.rotation.set(0.1, 0.5, 0);
      scene.add(m);
      const r = new THREE.Box3().setFromObject(m).getBoundingSphere(new THREE.Sphere()).radius;
      camera.position.set(0, r * 0.6, r * 3.4);
      controls.minDistance = r * 1.6;
      controls.maxDistance = r * 6;
      controls.target.set(0, 0, 0);
      controls.update();
      setReady(true);
    });

    const resize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight, false);
      camera.aspect = el.clientWidth / Math.max(1, el.clientHeight);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    let frame = 0;
    const loop = () => {
      frame = requestAnimationFrame(loop);
      controls.update();
      renderer.render(scene, camera);
    };
    loop();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      controls.dispose();
      scene.environment?.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [model]);

  return (
    <div className={className}>
      <div ref={host} className="absolute inset-0 cursor-grab active:cursor-grabbing [&>canvas]:h-full [&>canvas]:w-full" />
      {!ready && <div className="absolute inset-0 m-auto h-24 w-24 animate-pulse rounded-full bg-petal" />}
      <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-3 py-1 text-[0.75rem] text-plum/70 backdrop-blur">Drag to turn · scroll to zoom</p>
    </div>
  );
}

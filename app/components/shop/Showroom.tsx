"use client";

// The hero showroom: the six products that have real 3D models stand on lit plinths in a ring.
// The ring turns one stop every few seconds (and a little more as you scroll), the front product
// lifts and spins, and hovering/clicking a product brings it to the front or opens it.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { disposeOwned, loadProduct, MODEL_IDS, studioEnvironment, type ModelId } from "../three/products";

const R = 2.8;
const STEP = (Math.PI * 2) / MODEL_IDS.length;

export default function Showroom({ onFront, onOpen, className = "" }: { onFront(id: ModelId): void; onOpen(id: ModelId): void; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const cb = useRef({ onFront, onOpen });
  useEffect(() => {
    cb.current = { onFront, onOpen };
  }, [onFront, onOpen]);

  useEffect(() => {
    const el = host.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.environment = studioEnvironment(renderer);
    scene.environmentIntensity = 0.8;
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);

    // Lights: a warm key that casts soft shadows, a berry rim from behind.
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(3, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 6;
    Object.assign(key.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7 });
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xf472b6, 1.8);
    rim.position.set(-5, 3, -6);
    scene.add(rim, new THREE.AmbientLight(0xffffff, 0.25));

    // Floor: a soft, glossy blush disc that fades into the page.
    const floor = new THREE.Mesh(new THREE.CircleGeometry(5, 96), new THREE.ShadowMaterial({ color: 0x7c1648, opacity: 0.16 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(4.2, 96),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        vertexShader: "varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
        fragmentShader: "varying vec2 vU; void main(){ float d = length(vU - 0.5) * 2.0; gl_FragColor = vec4(0.98, 0.66, 0.83, (1.0 - smoothstep(0.0, 1.0, d)) * 0.55); }",
      }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.002;
    scene.add(glow);

    // Ring of plinths.
    const ring = new THREE.Group();
    scene.add(ring);
    const plinthMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 });
    const rimMat = new THREE.MeshBasicMaterial({ color: 0xbe185d, toneMapped: false });
    const owned: THREE.Mesh[] = [];
    const slots = MODEL_IDS.map((id, i) => {
      const a = i * STEP;
      const slot = new THREE.Group();
      slot.position.set(Math.sin(a) * R, 0, Math.cos(a) * R);
      const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.86, 0.5, 64), plinthMat);
      plinth.position.y = 0.25;
      plinth.castShadow = plinth.receiveShadow = true;
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.83, 0.012, 8, 96), rimMat);
      band.rotation.x = Math.PI / 2;
      band.position.y = 0.5;
      const holder = new THREE.Group();
      holder.position.y = 0.5;
      holder.scale.setScalar(1.12);
      slot.add(plinth, band, holder);
      owned.push(plinth, band);
      ring.add(slot);
      return { id, slot, holder, band, model: null as THREE.Object3D | null, lift: 0 };
    });
    let alive = true;
    MODEL_IDS.forEach((id, i) =>
      loadProduct(id).then((m) => {
        if (!alive) return;
        m.traverse((o) => ((o as THREE.Mesh).castShadow = true));
        // Sit the model on its plinth.
        const box = new THREE.Box3().setFromObject(m);
        m.position.y = -box.min.y + 0.02;
        slots[i]!.holder.add(m);
        slots[i]!.model = m;
      }),
    );

    // Turning: `stop` is which product is at the front; the ring eases toward it.
    let stop = 0, angle = 0, hovered = -1, lastFront = -1;
    let nextTurn = performance.now() + 3600;
    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = w < 640 ? 40 : 32;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), mouse = { x: 0, y: 0 };
    const pick = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      mouse.x = ptr.x;
      mouse.y = ptr.y;
      ray.setFromCamera(ptr, camera);
      const hit = ray.intersectObjects(slots.map((s) => s.slot), true)[0];
      if (!hit) return -1;
      return slots.findIndex((s) => s.slot === hit.object || s.slot.getObjectById(hit.object.id));
    };
    const onMove = (e: PointerEvent) => {
      hovered = pick(e);
      el.style.cursor = hovered >= 0 ? "pointer" : "";
    };
    const onClick = (e: PointerEvent) => {
      const i = pick(e);
      if (i < 0) return;
      if (i === ((stop % slots.length) + slots.length) % slots.length) cb.current.onOpen(slots[i]!.id);
      else {
        // Turn the shortest way to bring it to the front.
        const cur = ((stop % slots.length) + slots.length) % slots.length;
        let d = i - cur;
        if (d > slots.length / 2) d -= slots.length;
        if (d < -slots.length / 2) d += slots.length;
        stop += d;
      }
      nextTurn = performance.now() + 6000;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("click", onClick as EventListener);

    let frame = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    io.observe(el);
    const clock = new THREE.Clock();
    const draw = () => {
      const t = clock.getElapsedTime();
      const now = performance.now();
      if (!still && hovered < 0 && now > nextTurn) {
        stop++;
        nextTurn = now + 3600;
      }
      // Scrolling past the hero turns the ring a little further, so the page feels physical.
      const scroll = Math.min(1, window.scrollY / Math.max(1, el.clientHeight));
      const goal = -stop * STEP - scroll * STEP * 1.5;
      angle += (goal - angle) * (still ? 1 : 0.06);
      ring.rotation.y = angle;
      const front = ((stop % slots.length) + slots.length) % slots.length;
      if (front !== lastFront) {
        lastFront = front;
        cb.current.onFront(slots[front]!.id);
      }
      slots.forEach((s, i) => {
        const on = i === front;
        s.lift += ((on ? 0.35 : i === hovered ? 0.15 : 0) - s.lift) * 0.08;
        s.holder.position.y = 0.5 + s.lift + (on && !still ? Math.sin(t * 1.6) * 0.05 : 0);
        s.holder.rotation.y = on && !still ? t * 0.6 : -ring.rotation.y - i * STEP + 0.4;
        s.band.visible = on;
      });
      camera.position.set(mouse.x * 0.6, 3.2 + scroll * 1.6 - mouse.y * 0.3, 11.6 - scroll * 1.2);
      camera.lookAt(0, 1.1 + scroll * 0.3, R * 0.4);
      renderer.render(scene, camera);
    };
    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (visible && !document.hidden) draw();
    };
    loop();

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("click", onClick as EventListener);
      disposeOwned([floor, glow, ...owned]);
      scene.environment?.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} className={`[&>canvas]:h-full [&>canvas]:w-full ${className}`} />;
}

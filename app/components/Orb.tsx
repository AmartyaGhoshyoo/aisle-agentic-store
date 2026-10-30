"use client";

// The shopping agent as a living 3D blob: a sphere whose surface ripples (vertex noise),
// shaded berry → lilac → mint with a soft rim. `energy` (0–1) makes it pulse harder,
// used while it "pulls in" the picks. Pauses off-screen; still frame under reduced motion.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "motion/react";

const vertex = /* glsl */ `
  uniform float uT; uniform float uE;
  varying vec3 vN; varying vec3 vP;
  float wave(vec3 p){ return sin(p.x*2.6+uT)*sin(p.y*3.1+uT*1.3)*sin(p.z*2.2+uT*0.8); }
  void main(){
    float d = wave(position) * (0.13 + uE*0.12) + sin(position.y*6.0+uT*2.0)*0.02;
    vec3 p = position + normal * d;
    vN = normalize(normalMatrix * normal);
    vP = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const fragment = /* glsl */ `
  uniform float uT;
  varying vec3 vN; varying vec3 vP;
  void main(){
    vec3 berry = vec3(0.86, 0.15, 0.47);
    vec3 lilac = vec3(0.55, 0.36, 0.96);
    vec3 mint  = vec3(0.20, 0.83, 0.60);
    vec3 pink  = vec3(1.0, 0.78, 0.89);
    float a = 0.5 + 0.5*sin(vP.y*1.6 + uT*0.6);
    float b = 0.5 + 0.5*sin(vP.x*1.9 - uT*0.4);
    vec3 c = mix(mix(berry, lilac, a), mint, b*0.35);
    float fres = pow(1.0 - max(dot(vN, vec3(0.0,0.0,1.0)), 0.0), 2.2);
    float spec = pow(max(dot(vN, normalize(vec3(-0.4,0.6,0.7))), 0.0), 24.0);
    c = mix(c, pink, fres*0.75) + spec*0.55;
    gl_FragColor = vec4(c, 1.0);
  }
`;

export default function Orb({ energy, className = "" }: { energy?: MotionValue<number>; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const energyRef = useRef(energy);
  useEffect(() => {
    energyRef.current = energy;
  }, [energy]);

  useEffect(() => {
    const el = host.current!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
    camera.position.z = 6.4;
    const uniforms = { uT: { value: 0 }, uE: { value: 0 } };
    const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 64), new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms }));
    scene.add(blob);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e?.isIntersecting ?? true));
    io.observe(el);

    let frame = 0;
    const clock = new THREE.Clock();
    const draw = () => {
      const t = still ? 2 : clock.getElapsedTime();
      const e = energyRef.current?.get() ?? 0;
      uniforms.uT.value = t * (1 + e * 1.5);
      uniforms.uE.value = e;
      blob.rotation.y = t * 0.15;
      blob.rotation.x = Math.sin(t * 0.3) * 0.2;
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
      io.disconnect();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} aria-hidden="true" className={`[&>canvas]:h-full [&>canvas]:w-full ${className}`} />;
}

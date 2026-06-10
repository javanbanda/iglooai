import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_strength;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float dist = distance(uv, u_mouse);
  float displacement = sin(dist * 30.0 - u_time * 2.0) * exp(-dist * 5.0) * u_strength;
  uv += displacement;
  vec4 color = texture2D(u_texture, uv);
  gl_FragColor = color;
}
`;

interface NoiseRippleProps {
  imageSrc: string;
  className?: string;
}

export default function NoiseRipple({ imageSrc, className = '' }: NoiseRippleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const aspect = w / h;
    const frustum = 1;
    const camera = new THREE.OrthographicCamera(
      -frustum * aspect, frustum * aspect,
      frustum, -frustum,
      0.1, 10
    );
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const loader = new THREE.TextureLoader();
    const texture = loader.load(imageSrc);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const uniforms = {
      u_texture: { value: texture },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_time: { value: 0 },
      u_strength: { value: 0.04 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const geoW = frustum * aspect * 2;
    const geoH = frustum * 2;
    const geometry = new THREE.PlaneGeometry(geoW, geoH);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    container.addEventListener('mousemove', onMouseMove);

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(container);

    const onResize = () => {
      const nw = container.offsetWidth;
      const nh = container.offsetHeight;
      const naspect = nw / nh;
      renderer.setSize(nw, nh);
      camera.left = -frustum * naspect;
      camera.right = frustum * naspect;
      camera.updateProjectionMatrix();
      mesh.geometry.dispose();
      mesh.geometry = new THREE.PlaneGeometry(frustum * naspect * 2, frustum * 2);
    };
    window.addEventListener('resize', onResize);

    const startTime = performance.now() * 0.001;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;
      uniforms.u_time.value = performance.now() * 0.001 - startTime;
      uniforms.u_mouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.08
      );
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
    />
  );
}

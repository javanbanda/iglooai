import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float u_time;
uniform vec2 u_res;
uniform float u_patternScale;
uniform float u_animalType;
uniform float u_animSpeed;
uniform float u_rotAngle;
uniform float u_showMask;
uniform float u_discoMode;
uniform float u_glitter;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash2(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 noised(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  vec2 du = 6.0 * f * (1.0 - f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  float val = mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  vec2 deriv = du * (vec2(b - a, c - a) + (a - b - c + d) * u.yx * vec2(1.0, -1.0));
  return vec3(val, deriv);
}

float fbm(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    v += a * vnoise(p);
    p = rot * p * 2.0 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 fbmd(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  vec2 d = vec2(0.0);
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    vec3 n = noised(p);
    v += a * n.x;
    d += a * n.yz;
    p = rot * p * 2.0 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return vec3(v, d);
}

float ridged(vec2 p, int octaves) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    v += a * (1.0 - abs(vnoise(p) * 2.0 - 1.0));
    p = rot * p * 2.0 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void domainWarp(vec2 p, float t, out vec2 q, out vec2 r) {
  q = vec2(fbm(p + vec2(0.0, 0.0) + t * 0.04, 4), fbm(p + vec2(5.2, 1.3) + t * 0.03, 4));
  r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.05, 4), fbm(p + 3.0 * q + vec2(8.3, 2.8) + t * 0.04, 4));
}

float triGrid(vec2 p, float size, float lineWidth) {
  float halfSize = size * 0.5;
  float ht = halfSize * sqrt(3.0);
  vec2 pi = vec2(mod(p.x, size) - halfSize, mod(p.y, ht));
  vec2 idx = floor(vec2(p.x / size, p.y / ht));
  if (mod(idx.x + idx.y, 2.0) > 0.5) pi.y = ht - pi.y;
  float d1 = abs(pi.y);
  float d2 = abs(pi.x * sqrt(3.0) * 0.5 + pi.y * 0.5);
  float d3 = abs(-pi.x * sqrt(3.0) * 0.5 + pi.y * 0.5);
  float d = max(max(d1, d2), d3);
  return 1.0 - smoothstep(lineWidth * 0.5, lineWidth, d);
}

mat2 rot2(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat2(c, -s, s, c);
}

float star5(vec2 p, float r, float rf) {
  float angle = atan(p.x, p.y) / PI;
  float seg = floor(angle * 5.0) * (PI / 5.0);
  vec2 pSeg = rot2(-seg) * p;
  vec2 a = vec2(cos(PI / 5.0), sin(PI / 5.0)) * r;
  vec2 b = vec2(0.0, r);
  vec2 i = b - a;
  vec2 n = vec2(-i.y, i.x);
  float d = dot(pSeg - a, n);
  float rf2 = mix(rf, 1.0, 0.5);
  vec2 q = vec2(abs(pSeg.x), pSeg.y - r * rf2);
  float l = length(q);
  float m = clamp((q.y - l * a.y / length(a)) / length(a), 0.0, 1.0);
  float k = length(q - a * m);
  float s = dot(pSeg, normalize(vec2(a.y, -a.x)));
  return max(max(d / length(n), s), mix(k, l, step(a.y, q.y)));
}

float bat(vec2 p) {
  p.x = abs(p.x);
  return max(-p.y, p.y * 1.2 - abs(p.x) * 1.5 + 0.5);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  vec2 p = uv * u_patternScale;
  float t = u_time * u_animSpeed;

  vec2 q, r;
  domainWarp(p, t, q, r);

  float f = length(q);

  vec3 edgeColor = vec3(0.15, 0.10, 0.08);
  vec3 centerColor = vec3(1.0, 0.92, 0.82);

  float vn = vnoise(r * 2.5 + t * 0.15);
  float shapeNoise = smoothstep(0.2, 0.8, vn);

  int animalIdx = int(floor(u_animalType));
  float animalPattern = 0.0;
  float animalMask = 0.0;

  if (animalIdx == 0) {
    vec2 foxUV = q * 1.5;
    float fx = foxUV.x;
    float fy = foxUV.y;
    float foxHead = length(vec2(fx * 0.9, fy * 1.1)) - 0.35;
    foxHead = max(foxHead, -(fy - 0.15));
    foxHead = max(foxHead, abs(fx) - 0.25);
    float earL = length(vec2(fx + 0.25, fy - 0.32) * vec2(1.0, 1.5)) - 0.12;
    float earR = length(vec2(fx - 0.25, fy - 0.32) * vec2(1.0, 1.5)) - 0.12;
    float foxMask = min(min(foxHead, earL), earR);
    animalPattern = smoothstep(0.05, -0.02, foxMask);
    animalMask = 1.0 - smoothstep(-0.02, 0.08, foxMask);
  } else if (animalIdx == 1) {
    vec2 starUV = q * 3.0;
    float starDF = star5(starUV, 0.5, 0.4);
    animalPattern = smoothstep(0.05, -0.02, starDF);
    animalMask = 1.0 - smoothstep(-0.02, 0.08, starDF);
  } else if (animalIdx == 2) {
    vec2 batUV = q * 2.0 + vec2(0.0, 0.15);
    float batDF = bat(rot2(PI) * batUV);
    animalPattern = smoothstep(0.05, -0.02, batDF);
    animalMask = 1.0 - smoothstep(-0.02, 0.08, batDF);
  } else if (animalIdx == 3) {
    animalPattern = 0.0;
    animalMask = 0.0;
  }

  vec2 wmUV = uv * u_patternScale * 8.0;
  float wmT = t * 0.15;

  vec2 wmR = vec2(fbm(wmUV * vec2(80.0, 1.0) + wmT, 3), fbm(wmUV * vec2(1.0, 80.0) + wmT * 0.8, 3));
  vec2 wmF = vec2(fbm(wmUV * vec2(60.0, 1.0) + wmT * 0.7 + 10.0, 3), fbm(wmUV * vec2(1.0, 60.0) + wmT * 0.6 + 20.0, 3));
  vec2 wmA = vec2(fbm(wmUV * vec2(100.0, 1.0) + wmT * 1.2 + 30.0, 3), fbm(wmUV * vec2(1.0, 100.0) + wmT * 1.1 + 40.0, 3));
  vec2 wmB = vec2(fbm(wmUV * vec2(70.0, 1.0) + wmT * 0.9 + 50.0, 3), fbm(wmUV * vec2(1.0, 70.0) + wmT * 0.85 + 60.0, 3));

  wmUV += (wmR + wmF + wmA + wmB) * 0.1;
  float wmCenter = smoothstep(0.2, 0.8, vnoise(wmUV * 2.5 + wmT * 0.3));

  float wmGrid = smoothstep(0.48, 0.5, max(sin(wmUV.x * TAU + wmT) * sin(wmUV.y * TAU + wmT * 0.8), 0.0));

  float wmThreads = clamp(wmR.x + wmF.y + wmA.x * 0.5 + wmB.y * 0.5, 0.0, 1.0);

  float wmDither = hash2(gl_FragCoord.xy + fract(u_time) * 100.0).x;

  float wmEdge = smoothstep(0.15, 0.45, f);

  vec3 wmBase = vec3(0.86, 0.82, 0.78);
  vec3 wmRed = vec3(0.85, 0.25, 0.15);
  vec3 wmAmber = vec3(0.92, 0.65, 0.18);
  vec3 wmTeal = vec3(0.18, 0.68, 0.58);
  vec3 wmOrange = vec3(0.92, 0.52, 0.18);
  vec3 wmBlack = vec3(0.20, 0.22, 0.24);
  vec3 wmWhite = vec3(0.98, 0.98, 0.98);

  vec3 wmColor = wmBase;
  wmColor = mix(wmColor, wmRed, wmCenter * 0.7);
  wmColor = mix(wmColor, wmAmber, wmThreads * 0.6);
  wmColor = mix(wmColor, wmTeal, wmGrid * 0.5);
  wmColor = mix(wmColor, wmOrange, wmEdge * 0.4);
  wmColor = mix(wmColor, wmBlack, (1.0 - wmEdge) * 0.25);
  wmColor += wmWhite * wmDither * 0.1;

  float wmTriGrid = triGrid(p, 0.35, 0.025);

  wmColor += vec3(0.08, 0.06, 0.04) * wmTriGrid * (1.0 - wmEdge);
  wmColor -= vec3(0.05, 0.04, 0.03) * (1.0 - wmTriGrid) * (1.0 - wmEdge);
  wmColor += vec3(0.05) * wmDither * (1.0 - wmEdge) * 0.3;

  vec3 col = mix(wmColor, edgeColor, smoothstep(0.15, 0.45, f));

  if (u_discoMode > 0.5) {
    col = mix(col, vec3(0.5 + 0.5 * cos(t * 0.5 + uv.xyx * 2.0 + vec3(0.0, 2.0, 4.0))), 0.3);
  }

  float fhatch = smoothstep(0.3, 0.7, hash2(floor(gl_FragCoord.xy * 0.5) + t * 0.1).x);
  col += vec3(0.04, 0.035, 0.03) * fhatch * (1.0 - smoothstep(0.15, 0.45, f));

  col += vec3(1.0, 0.98, 0.95) * u_glitter * hash2(gl_FragCoord.xy + floor(t * 30.0) * 7.0).x * smoothstep(0.0, 0.15, f) * (1.0 - smoothstep(0.4, 0.5, f));

  float spot1 = smoothstep(0.8, 0.0, length(uv - vec2(-0.3, 0.2)));
  float spot2 = smoothstep(0.6, 0.0, length(uv - vec2(0.4, -0.3)));
  float spot3 = smoothstep(0.9, 0.0, length(uv - vec2(0.2, 0.4)));
  float spot4 = smoothstep(0.7, 0.0, length(uv - vec2(-0.4, -0.2)));
  col += vec3(0.06, 0.05, 0.03) * (spot1 + spot2 * 0.8 + spot3 * 0.6 + spot4 * 0.7);

  if (animalMask > 0.01) {
    col += centerColor * shapeNoise * 0.3 * animalMask;
    col += vec3(0.0, 0.15, 0.2) * (1.0 - shapeNoise) * 0.15 * animalMask;
  }

  col *= 0.8 + 0.2 * (1.0 - smoothstep(0.3, 1.2, length(uv * vec2(0.9, 1.0))));
  col = pow(max(col, 0.0), vec3(0.95));
  col = max(col * 1.1 - 0.05, 0.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function FormicaFoxShader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const uniforms = {
      u_time: { value: 0.0 },
      u_res: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
      u_patternScale: { value: 1.5 },
      u_animalType: { value: 0.0 },
      u_animSpeed: { value: 0.3 },
      u_rotAngle: { value: 0.0 },
      u_showMask: { value: 0.0 },
      u_discoMode: { value: 0.0 },
      u_glitter: { value: 0.2 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(container);

    const onResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      uniforms.u_res.value.set(w, h);
    };
    window.addEventListener('resize', onResize);

    const startTime = performance.now() * 0.001;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;
      uniforms.u_time.value = performance.now() * 0.001 - startTime;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
}

import * as THREE from 'three';
import { vertex, fragment } from '../shaders/particle';
import type { Creature } from '../creatures/presets';
import type { Controls } from '../state/controls';

const color = (s: string) => new THREE.Color(s);
const isLowPerformanceDevice = () => {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency || 8;
  return Boolean((memory && memory <= 4) || cores <= 4);
};

export class ParticleRenderer {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  material!: THREE.ShaderMaterial;
  points!: THREE.Points;
  count = 0;
  pointer = new THREE.Vector2(99, 99);
  start = performance.now();
  private resizeObserver: ResizeObserver;
  private disposed = false;
  private readonly maxParticles = isLowPerformanceDevice() ? 50000 : 100000;
  private readonly pixelRatioCap = isLowPerformanceDevice() ? 1.25 : 2;
  private readonly onPointerMove = (e: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  };

  constructor(private host: HTMLElement) {
    host.querySelectorAll('canvas[data-marine-renderer="true"]').forEach((canvas) => canvas.remove());
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    this.renderer.domElement.dataset.marineRenderer = 'true';
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.pixelRatioCap));
    this.renderer.setClearColor(0x030713, 1);
    host.appendChild(this.renderer.domElement);
    this.camera.position.z = 4;
    this.resize();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove, { passive: true });
  }

  resize() {
    if (this.disposed) return;
    const width = Math.max(1, this.host.clientWidth), height = Math.max(1, this.host.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  build(requestedCount: number) {
    const n = Math.min(requestedCount, this.maxParticles);
    if (this.points) { this.scene.remove(this.points); this.points.geometry.dispose(); this.material.dispose(); }
    this.count = n;
    const seed = new Float32Array(n), u = new Float32Array(n), v = new Float32Array(n), part = new Float32Array(n);
    for (let i = 0; i < n; i++) { seed[i] = Math.random(); u[i] = Math.random(); v[i] = Math.random(); part[i] = i % 16; }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    geometry.setAttribute('aU', new THREE.BufferAttribute(u, 1));
    geometry.setAttribute('aV', new THREE.BufferAttribute(v, 1));
    geometry.setAttribute('aPart', new THREE.BufferAttribute(part, 1));
    this.material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: {
      uTime:{value:0},uScale:{value:1},uSpeed:{value:1},uPulse:{value:1},uTurbulence:{value:.3},uDeformation:{value:1},uPhase:{value:1},uAppendages:{value:8},uAspectX:{value:1},uAspectY:{value:1},uBody:{value:0},uPointerX:{value:99},uPointerY:{value:99},uParticleSize:{value:2.2},uHue:{value:0},uSaturation:{value:1},uBrightness:{value:1},uGlow:{value:1},uColorA:{value:color('#6cf4ff')},uColorB:{value:color('#ae7dff')},uColorC:{value:color('#fff')},
    }});
    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);
  }

  update(creature: Creature, controls: Controls) {
    if (this.disposed) return;
    const requested = Math.min(controls.density, this.maxParticles);
    if (!this.material || this.count !== requested) this.build(requested);
    const u = this.material.uniforms;
    const body = { bell:0,mantle:1,radial:2,carapace:3,segmented:4,curved:5 }[creature.body];
    u.uScale.value=controls.scale; u.uSpeed.value=controls.speed; u.uPulse.value=controls.pulse; u.uTurbulence.value=controls.turbulence;
    u.uDeformation.value=controls.deformation*creature.deformation; u.uPhase.value=controls.phase*creature.phase; u.uAppendages.value=controls.appendages||creature.appendages;
    u.uAspectX.value=creature.aspect[0]; u.uAspectY.value=creature.aspect[1]; u.uBody.value=body; u.uParticleSize.value=controls.size;
    u.uHue.value=controls.hue; u.uSaturation.value=controls.saturation; u.uBrightness.value=controls.brightness; u.uGlow.value=controls.glow;
    u.uColorA.value.set(creature.palette[0]); u.uColorB.value.set(creature.palette[1]); u.uColorC.value.set(creature.palette[2]);
  }

  render(paused: boolean) {
    if (this.disposed || !this.material) return;
    if (!paused) this.material.uniforms.uTime.value=(performance.now()-this.start)/1000;
    this.material.uniforms.uPointerX.value=this.pointer.x*1.5; this.material.uniforms.uPointerY.value=this.pointer.y;
    this.renderer.render(this.scene,this.camera);
  }

  dispose() {
    if (this.disposed) return; this.disposed=true; this.resizeObserver.disconnect();
    this.renderer.domElement.removeEventListener('pointermove',this.onPointerMove);
    if(this.points) this.points.geometry.dispose(); if(this.material) this.material.dispose();
    this.renderer.dispose(); this.renderer.domElement.remove();
  }
}

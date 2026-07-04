import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useMuseum } from '../../state/store'

/**
 * Instanced dust motes drifting through the gallery air.
 * One draw call; per-particle motion computed in the vertex shader.
 */
export function Dust({
  center = [0, 2.2, 0] as [number, number, number],
  size = [28, 4, 36] as [number, number, number],
  count = 500,
}) {
  const quality = useMuseum((s) => s.settings.quality)
  const n = quality === 'high' ? count : Math.floor(count / 4)
  const material = useRef<THREE.ShaderMaterial>(null!)

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(n * 3)
    const seeds = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (Math.random() - 0.5) * size[0]
      positions[i * 3 + 1] = (Math.random() - 0.5) * size[1]
      positions[i * 3 + 2] = (Math.random() - 0.5) * size[2]
      seeds[i] = Math.random() * 100
    }
    return { positions, seeds }
  }, [n, size[0], size[1], size[2]])

  useFrame(({ clock }) => {
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <points position={center}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={/* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            p.x += sin(uTime * 0.11 + aSeed) * 0.6;
            p.y += sin(uTime * 0.07 + aSeed * 2.1) * 0.5;
            p.z += cos(uTime * 0.09 + aSeed * 1.3) * 0.6;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            float dist = -mv.z;
            gl_PointSize = 13.0 / dist;
            vAlpha = smoothstep(22.0, 4.0, dist) * (0.3 + 0.3 * sin(uTime * 0.5 + aSeed * 7.0));
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.05, d) * vAlpha * 0.2;
            gl_FragColor = vec4(1.0, 0.92, 0.78, a);
          }
        `}
      />
    </points>
  )
}

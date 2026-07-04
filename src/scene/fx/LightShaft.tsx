import * as THREE from 'three'
import { useMemo } from 'react'

/**
 * A soft volumetric-looking light cone: additive gradient cylinder.
 * Fakes god rays for a fraction of the cost of real volumetrics.
 */
export function LightShaft({
  position,
  topRadius = 0.7,
  bottomRadius = 2.1,
  height = 5,
  color = '#cfd9ec',
  opacity = 0.05,
}: {
  position: [number, number, number]
  topRadius?: number
  bottomRadius?: number
  height?: number
  color?: string
  opacity?: number
}) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: opacity },
        },
        vertexShader: /* glsl */ `
          varying float vY;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vY = uv.y;
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying float vY;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            // fade at bottom, brighten toward source, fresnel-soft silhouette
            float grad = smoothstep(0.0, 0.85, vY);
            float fresnel = pow(abs(dot(vNormal, vView)), 1.6);
            gl_FragColor = vec4(uColor, uOpacity * grad * fresnel);
          }
        `,
      }),
    [color, opacity],
  )

  return (
    <mesh position={position} material={material}>
      <cylinderGeometry args={[topRadius, bottomRadius, height, 24, 1, true]} />
    </mesh>
  )
}

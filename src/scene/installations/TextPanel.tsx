import { Label as Text } from './Label'
import { FONTS } from '../../config/content'
import { ACCENT } from '../materials'

/**
 * Typography as installation: a heading + body writing directly on a wall.
 */
export function TextPanel({
  position,
  rotationY = 0,
  heading,
  body,
  width = 4,
  headingSize = 0.34,
  bodySize = 0.115,
  align = 'left',
}: {
  position: [number, number, number]
  rotationY?: number
  heading: string
  body?: string
  width?: number
  headingSize?: number
  bodySize?: number
  align?: 'left' | 'center'
}) {
  const anchorX = align === 'center' ? 'center' : 'left'
  const x = 0
  return (
    <group position={position} rotation-y={rotationY}>
      <Text
        font={FONTS.serif300}
        fontSize={headingSize}
        color="#ece6da"
        anchorX={anchorX}
        anchorY="top"
        position={[x, 0, 0]}
        maxWidth={width}
        textAlign={align}
      >
        {heading}
      </Text>
      <mesh position={[align === 'center' ? 0 : width * 0.14, -headingSize - 0.18, 0]}>
        <planeGeometry args={[align === 'center' ? width * 0.35 : width * 0.28, 0.012]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} transparent opacity={0.8} />
      </mesh>
      {body && (
        <Text
          font={FONTS.sans400}
          fontSize={bodySize}
          color="#b5afa2"
          anchorX={anchorX}
          anchorY="top"
          position={[x, -headingSize - 0.42, 0]}
          maxWidth={width}
          lineHeight={1.65}
          textAlign={align}
        >
          {body}
        </Text>
      )}
    </group>
  )
}

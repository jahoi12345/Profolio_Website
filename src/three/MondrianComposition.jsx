import * as THREE from 'three'
import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { easing } from 'maath'

// --- CONFIGURATION ---

// 1. Palette
const COLORS = {
  red: '#C62620',
  yellow: '#F0C62D',
  blue: '#204686',
  black: '#111111',
  darkGray: '#333333',
  green: '#006600',
  gray: '#D9D9D9',
  white: '#FFFFFF',
  bg: '#EAEAE8',
}

// 2. Layout Data
// We map your CSS percentages to a 10x10 coordinate system.
// X/Y range: -5 to +5. 
// Format: { x, y, w, h, color, depth }
const CANVAS_SIZE = 10
const LINE_THICK = 0.3 // Thickness of the black grid lines

const BLOCKS = [
  // --- COLOR PLANES ---
  // Red Square (Hero)
  { x: -1.8, y: 1.8, w: 5, h: 5, color: COLORS.red, depth: 2.5 },
  // Yellow Top Right
  { x: 3.2, y: 3.25, w: 2.8, h: 3.5, color: COLORS.yellow, depth: 1.2 },
  // Yellow Bottom Left
  { x: -4.3, y: -4.1, w: 1.4, h: 1.8, color: COLORS.yellow, depth: 1.2 },
  // Blue Bottom Right
  { x: 3.2, y: -4.1, w: 2.8, h: 1.8, color: COLORS.blue, depth: 1.2 },
  // Black Plane (The rectangle under red, distinct from lines) - Now Green
  { x: -3.05, y: -1.6, w: 2.5, h: 1.8, color: COLORS.green, depth: 1.2 },
  // Gray Plane
  { x: -0.55, y: -1.6, w: 2.5, h: 1.8, color: COLORS.gray, depth: 1.2 },
  // Red Corner Strip
  { x: 4.6, y: -4.1, w: 0.8, h: 1.8, color: COLORS.red, depth: 1.2 },

  // --- WHITE SECTIONS (Background areas) ---
  // Top Left White
  { x: -4.3, y: 4.3, w: 1.4, h: 1.4, color: COLORS.white, depth: 0.8 },
  // Top Middle White (above red)
  { x: -1.8, y: 4.3, w: 5, h: 1.4, color: COLORS.white, depth: 0.8 },
  // Top Right White (small section)
  { x: 3.2, y: 4.3, w: 1, h: 1.4, color: COLORS.white, depth: 0.8 },
  // Left Middle White (between red and yellow bottom)
  { x: -4.3, y: 0.9, w: 1.4, h: 2.5, color: COLORS.white, depth: 0.8 },
  // Right Middle White (between yellow top and blue)
  { x: 3.2, y: -0.7, w: 2.8, h: 3.4, color: COLORS.white, depth: 0.8 },
  // Bottom Middle White (between gray and blue)
  { x: -0.55, y: -3.2, w: 3.75, h: 0.9, color: COLORS.white, depth: 0.8 },
  // Far Right White (above red corner)
  { x: 4.6, y: -0.7, w: 0.8, h: 3.4, color: COLORS.white, depth: 0.8 },

  // --- GRID LINES (The Skeleton) ---
  // User Rule: Dark grey lines should be the "thinnest"
  
  // Vertical Lines
  { x: -4.3, y: 0.9, w: LINE_THICK, h: 8.2, color: COLORS.darkGray, depth: 0.4 }, // V-Left
  { x: 0.7, y: 0, w: LINE_THICK, h: 10, color: COLORS.darkGray, depth: 0.4 },     // V-Main
  { x: 4.2, y: 0, w: LINE_THICK, h: 10, color: COLORS.darkGray, depth: 0.4 },     // V-Right
  { x: -1.8, y: -1.6, w: LINE_THICK, h: 1.8, color: COLORS.darkGray, depth: 0.4 }, // V-Center-Small

  // Horizontal Lines
  { x: -0.4, y: 4.3, w: 9.2, h: LINE_THICK, color: COLORS.darkGray, depth: 0.4 }, // H-Top
  { x: -0.4, y: -0.7, w: 9.2, h: LINE_THICK, color: COLORS.darkGray, depth: 0.4 }, // H-Mid
  { x: 0, y: -3.2, w: 10, h: LINE_THICK, color: COLORS.darkGray, depth: 0.4 },    // H-Bottom
  { x: -4.3, y: -0.7, w: 1.4, h: LINE_THICK, color: COLORS.darkGray, depth: 0.4 }, // H-Far-Left
]

function MondrianBlock({ x, y, w, h, color, depth, seed = 0, isGridLine = false }) {
  const mesh = useRef()
  const [hovered, setHover] = useState(false)
  
  // Helper vectors for calculation
  const targetRotation = useMemo(() => new THREE.Euler(), [])
  const basePosition = useMemo(() => new THREE.Vector3(x, y, 0), [x, y])
  const noiseOffset = useMemo(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    z: Math.random() * 100,
  }), [])
  
  useFrame((state, delta) => {
    if (!mesh.current) return

    const time = state.clock.elapsedTime

    // 1. MOVEMENT - Add subtle noise-based movement (reduced)
    // Grid lines have 75% less noise (25% of original)
    const noiseMultiplier = isGridLine ? 0.25 : 1.0
    const noiseX = Math.sin(time * 0.3 + noiseOffset.x) * 0.08 * noiseMultiplier
    const noiseY = Math.cos(time * 0.4 + noiseOffset.y) * 0.08 * noiseMultiplier
    const noiseZ = Math.sin(time * 0.25 + noiseOffset.z) * 0.05 * noiseMultiplier
    
    const targetPos = new THREE.Vector3(
      basePosition.x + noiseX,
      basePosition.y + noiseY,
      basePosition.z + noiseZ
    )
    
    easing.damp3(mesh.current.position, targetPos, 0.3, delta)

    // 2. TILT LOGIC
    // We want the block to subtly look at the mouse cursor
    // Calculate mouse position relative to center of screen (-1 to 1)
    const mx = state.pointer.x
    const my = state.pointer.y

    // Calculate rotation strength based on distance
    // If we hover THIS specific block, tilt is stronger
    const tiltStrength = hovered ? 0.5 : 0.1
    
    // Set target rotation (inverted slightly for a "weighty" feel)
    // Rotate X based on Mouse Y, Rotate Y based on Mouse X
    targetRotation.x = -my * tiltStrength + noiseX * 0.3
    targetRotation.y = mx * tiltStrength + noiseY * 0.3
    targetRotation.z = noiseZ * 0.2

    // Smoothly damp current rotation to target rotation
    easing.dampE(mesh.current.rotation, targetRotation, 0.2, delta)

    // 3. HOVER SCALE
    // Subtle pop when hovered
    const scaleTarget = hovered ? 1.05 : 1
    easing.damp(mesh.current.scale, 'x', scaleTarget, 0.1, delta)
    easing.damp(mesh.current.scale, 'y', scaleTarget, 0.1, delta)
    easing.damp(mesh.current.scale, 'z', scaleTarget, 0.1, delta)
    
    // 4. COLOR BRIGHTNESS - Make brighter with noise (darker)
    const brightness = hovered ? 1.3 : 0.65 + Math.sin(time * 2 + seed) * 0.05
    const emissiveIntensity = Math.max(0, brightness)
    mesh.current.material.emissive.setHex(
      new THREE.Color(color).multiplyScalar(emissiveIntensity).getHex()
    )
  })

  return (
    <RoundedBox
      ref={mesh}
      args={[w, h, depth]} // Size: Width, Height, Depth
      radius={0.05}        // Small rounded corners for realism
      smoothness={4}
      position={[x, y, 0]}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial 
        color={color} 
        roughness={0.3} 
        metalness={0.2}
        emissive={color}
        emissiveIntensity={0.7}
      />
    </RoundedBox>
  )
}

const Mondrian = () => {
  // Scale everything up by 200% bigger (4x total - 2x from before, now 2x more)
  const scale = 4
  
  return (
    <group position={[0, 0, 0]} scale={[scale, scale, scale]}>
      {BLOCKS.map((block, i) => {
        // Check if block is a grid line (dark grey color with depth 0.4)
        const isGridLine = block.color === COLORS.darkGray && block.depth === 0.4
        return (
          <MondrianBlock key={i} {...block} seed={i * 0.1} isGridLine={isGridLine} />
        )
      })}
    </group>
  )
}

export default Mondrian

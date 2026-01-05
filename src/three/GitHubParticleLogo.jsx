import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { RoundedBoxGeometry } from 'three-stdlib'
import { easing } from 'maath'

extend({ RoundedBoxGeometry })

function GitHubParticleLogo({ resolution = 70, gap = 0.4, displacement = 6, intensity = 2, speed = 0.3, onHoverChange, isDragging = false }) {
  const meshRef = useRef()
  const hitBoxRef = useRef()
  const { raycaster, camera, gl } = useThree()
  
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const cursor = useMemo(() => new THREE.Vector3(), [])
  const oPos = useMemo(() => new THREE.Vector3(), [])
  const vec = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const isMouseOverLogoRef = useRef(false)
  const hasDraggedRef = useRef(false)
  const mouseDownPosRef = useRef({ x: 0, y: 0 })
  
  // Track mouse down position to detect drags
  useEffect(() => {
    const handleMouseDown = (event) => {
      hasDraggedRef.current = false
      mouseDownPosRef.current = { x: event.clientX, y: event.clientY }
    }
    
    const handleMouseMove = (event) => {
      if (mouseDownPosRef.current.x !== 0 || mouseDownPosRef.current.y !== 0) {
        const deltaX = Math.abs(event.clientX - mouseDownPosRef.current.x)
        const deltaY = Math.abs(event.clientY - mouseDownPosRef.current.y)
        const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        // If mouse moved more than 5 pixels, consider it a drag (matches DraggableRotatingGroup threshold)
        if (moveDistance > 5) {
          hasDraggedRef.current = true
        }
      }
    }
    
    const handleMouseUp = () => {
      mouseDownPosRef.current = { x: 0, y: 0 }
    }
    
    gl.domElement.addEventListener('mousedown', handleMouseDown)
    gl.domElement.addEventListener('mousemove', handleMouseMove)
    gl.domElement.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      gl.domElement.removeEventListener('mousemove', handleMouseMove)
      gl.domElement.removeEventListener('mouseup', handleMouseUp)
    }
  }, [gl])
  
  // Handle click to open GitHub profile - only if no drag occurred
  useEffect(() => {
    const handleClick = (event) => {
      // Only open link if mouse was over logo AND no significant drag occurred
      // DraggableRotatingGroup uses 5px threshold, so if hasDraggedRef is false, it was a click
      if (isMouseOverLogoRef.current && !hasDraggedRef.current && !isDragging) {
        window.open('https://github.com/jahoi12345', '_blank', 'noopener,noreferrer')
      }
      // Reset drag flag after click
      hasDraggedRef.current = false
    }
    
    gl.domElement.addEventListener('click', handleClick, true) // Use capture phase
    return () => gl.domElement.removeEventListener('click', handleClick, true)
  }, [gl, isDragging])
  
  // Reset hover state when mouse leaves canvas
  useEffect(() => {
    const handleMouseLeave = () => {
      if (isMouseOverLogoRef.current) {
        isMouseOverLogoRef.current = false
        if (onHoverChange) {
          onHoverChange(false)
        }
      }
    }
    
    gl.domElement.addEventListener('mouseleave', handleMouseLeave)
    return () => gl.domElement.removeEventListener('mouseleave', handleMouseLeave)
  }, [gl, onHoverChange])
  
  const { particles, boxSize, halfDepth, zCenter } = useMemo(() => {
    const tempParticles = []
    
    // --- Canvas Setup ---
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = resolution
    canvas.height = resolution
    
    // 1. Fill Background Black
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, resolution, resolution)
    
    // 2. Draw The New Thickened Path
    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
    
    // The updated path provided by user
    const thickenedPath = "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.8-1.61-4.8-1.61C3.5 18.07 2.8 17.7 2.8 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    const p = new Path2D(thickenedPath)
    
    // Scale Octocat to fit INSIDE the middle ring
    const scaleFactor = 0.5
    const scale = (resolution / 24) * scaleFactor
    const margin = (resolution - (24 * scale)) / 2
    
    ctx.save()
    ctx.translate(margin, margin) 
    ctx.scale(scale, scale)       
    
    ctx.fill(p) 
    
    // Add a smaller stroke to ensure edges are captured by the grid
    ctx.lineWidth = 0.6 
    ctx.stroke(p)
    
    ctx.restore()
    
    const data = ctx.getImageData(0, 0, resolution, resolution).data
    const center = (resolution * gap) / 2 - gap / 2
    const cx = resolution / 2
    const cy = resolution / 2

    // --- RADIUS DEFINITIONS ---
    // 1. Outer Edge of the ring
    const rOuter = resolution / 2.2
    
    // 2. Inner Edge of the ring
    // Creates a thin sharp ring
    const rInner = resolution / 2.25
    
    // --- COLORS ---
    const cLightGrey = new THREE.Color('#e0e0e0').multiplyScalar(1.2)
    const cDarkGrey = new THREE.Color('#202020').multiplyScalar(1.2)

    for (let x = 0; x < resolution; x++) {
      for (let y = 0; y < resolution; y++) {
        const canvasY = resolution - 1 - y
        const index = (canvasY * resolution + x) * 4
        const r = data[index]
        
        // Pixel Analysis
        const isCatPixel = r > 100; 

        // Distance Analysis
        const dx = x - cx
        const dy = canvasY - cy
        const distSq = dx*dx + dy*dy
        const dist = Math.sqrt(distSq)

        // --- ZONE LOGIC ---
        let zone = 'NONE' 
        
        if (dist > rOuter) {
            zone = 'NONE'
        } else if (dist > rInner) {
            // LAYER 1: Thin Outer Ring (Light)
            zone = 'RING'
        } else {
            // Inside the Ring (Middle Area)
            if (isCatPixel) {
                // LAYER 3: The Octocat (Light)
                zone = 'CAT'
            } else {
                // LAYER 2: Dark Middle Background (Dark)
                zone = 'MIDDLE_DARK'
            }
        }

        if (zone === 'NONE') continue;

        for (let z = 0; z < resolution; z++) {
          const isVolume = z > resolution - 30; 

          if (isVolume) {
            
            // DENSITY & COLOR MAPPING
            let col = cLightGrey
            let keepRate = 0
            let jitter = 0.5
            let isText = false

            if (zone === 'RING') {
                col = cLightGrey
                keepRate = 0.25 // Dense
                jitter = 0.5
            } else if (zone === 'MIDDLE_DARK') {
                col = cDarkGrey
                keepRate = 0.25 // Dense dark field
                jitter = 0.5
            } else if (zone === 'CAT') {
                col = cLightGrey
                keepRate = 0.25 // Dense cat
                jitter = 0.0    // Sharp edges (0 jitter)
                isText = true
            }

            if (Math.random() > keepRate) continue;

            const posX = x * gap - center + (Math.random() * jitter - jitter/2)
            const posY = y * gap - center + (Math.random() * jitter - jitter/2)
            const posZ = z * gap - center + (Math.random() * jitter - jitter/2)

            tempParticles.push({
                anchor: new THREE.Vector3(posX, posY, posZ),
                color: col,
                currentPos: new THREE.Vector3(posX, posY, posZ),
                currentColor: col.clone(),
                seedX: Math.random() * 100,
                seedY: Math.random() * 100,
                seedZ: Math.random() * 100,
                speedFactor: 0.4 + Math.random() * 0.6,
                isText: isText
            })
            
          }
        }
      }
    }
    
    const totalSize = resolution * gap;
    const actualDepth = totalSize / 2;
    
    // Calculate the actual center of the particle volume in Z
    // Particles are in z > resolution - 30, so:
    // Min Z: (resolution - 30) * gap - center
    // Max Z: (resolution - 1) * gap - center
    // Center Z: average of min and max
    const zMin = (resolution - 30) * gap - center
    const zMax = (resolution - 1) * gap - center
    const zCenter = (zMin + zMax) / 2

    return { particles: tempParticles, boxSize: totalSize, halfDepth: actualDepth, zCenter }
  }, [resolution, gap])

  useFrame((state, delta) => {
    const mesh = meshRef.current
    const hitBox = hitBoxRef.current
    if (!mesh || !hitBox) return
    const time = state.clock.elapsedTime * speed

    // Improved mouse detection - works from all sides using sphere intersection
    raycaster.setFromCamera(state.pointer, camera)
    
    // Update hitbox matrixWorld for accurate intersection
    hitBox.updateMatrixWorld(true)
    
    // Use actual mesh intersection - sphere works from all angles
    const intersects = raycaster.intersectObject(hitBox, false)
    
    let isMouseOverLogo = intersects.length > 0
    let intersectPoint = new THREE.Vector3()
    
    if (isMouseOverLogo) {
      // Use the actual intersection point from the raycast (in world space)
      intersectPoint.copy(intersects[0].point)
      
      // Get the logo center in world space for cursor positioning
      const logoCenterWorld = new THREE.Vector3()
      hitBox.getWorldPosition(logoCenterWorld)
      
      // Project intersection point to a reasonable distance from center for particle effects
      const distToCenter = intersectPoint.distanceTo(logoCenterWorld)
      const maxDist = Math.max(boxSize, halfDepth) * 0.7
      if (distToCenter > maxDist) {
        const direction = intersectPoint.clone().sub(logoCenterWorld).normalize()
        intersectPoint = logoCenterWorld.clone().add(direction.multiplyScalar(maxDist * 0.9))
      }
      
      // Transform the world-space intersection point to the local space of the particles
      // The mesh is inside a group that's offset by -zCenter, so we need to transform to that space
      mesh.updateMatrixWorld(true)
      cursor.copy(intersectPoint)
      mesh.worldToLocal(cursor)
    } else {
      cursor.set(10000, 10000, 10000)
    }
    
    if (isMouseOverLogo) {
      if (!isMouseOverLogoRef.current) {
        isMouseOverLogoRef.current = true
        if (onHoverChange) {
          onHoverChange(true)
        }
      }
    }
    
    if (!isMouseOverLogo) {
      if (isMouseOverLogoRef.current) {
        isMouseOverLogoRef.current = false
        if (onHoverChange) {
          onHoverChange(false)
        }
      }
    }

    let i = 0
    for (const particle of particles) {
      oPos.copy(particle.anchor)

      const driftMagnitude = particle.isText ? 0.2 : 1.0;
      oPos.x += Math.sin(time * particle.speedFactor + particle.seedX) * driftMagnitude
      oPos.y += Math.cos(time * particle.speedFactor * 0.9 + particle.seedY) * driftMagnitude
      oPos.z += Math.sin(time * particle.speedFactor * 0.7 + particle.seedZ) * driftMagnitude

      const dist = oPos.distanceTo(cursor)
      const isHovered = dist < displacement && isMouseOverLogo

      if (isHovered) {
        dir.copy(oPos).sub(cursor).normalize()
        const distInv = displacement - dist
        const mov = 1 + Math.sin(time * 3 + i)
        vec.copy(oPos).add(dir.multiplyScalar(distInv * intensity + mov / 4))
      } else {
        vec.copy(oPos)
      }
      
      easing.damp3(particle.currentPos, vec, 0.3, delta)

      dummy.position.copy(particle.currentPos)
      dummy.rotation.set(time * 0.2 + particle.seedX, time * 0.2 + particle.seedY, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      // Hover flash (reduced by 50%)
      const targetColor = isHovered ? [1.5, 1.5, 1.5] : particle.color
      easing.dampC(particle.currentColor, targetColor, 0.15, delta)
      mesh.setColorAt(i, particle.currentColor)

      i++
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return (
    <group>
      {/* Offset the entire logo by -zCenter so rotation happens around the true center (0,0,0) */}
      <group position={[0, 0, -zCenter]}>
        <instancedMesh ref={meshRef} args={[null, null, particles.length]} castShadow receiveShadow>
          <roundedBoxGeometry args={[0.3, 0.3, 0.3, 2, 0.02]} />
          <meshLambertMaterial />
        </instancedMesh>
      </group>

      {/* HITBOX - Positioned at origin (0,0,0) which is now the center of particle volume */}
      {/* Using box geometry for better detection from all sides of the cylinder - 200% bigger for easier clicking */}
      <mesh ref={hitBoxRef} position={[0, 0, 0]} visible={false}>
        <boxGeometry args={[boxSize * 2.4, boxSize * 2.4, halfDepth * 2.4]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}

export default GitHubParticleLogo


import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { RoundedBoxGeometry } from 'three-stdlib'
import { easing } from 'maath'

extend({ RoundedBoxGeometry })

function LinkedInParticleLogo({ resolution = 60, gap = 0.45, displacement = 6, intensity = 2, speed = 0.3, onHoverChange, isDragging = false }) {
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
  
  // Handle click to open LinkedIn profile - only if no drag occurred
  useEffect(() => {
    const handleClick = (event) => {
      // Only open link if mouse was over logo AND no significant drag occurred
      // DraggableRotatingGroup uses 5px threshold, so if hasDraggedRef is false, it was a click
      if (isMouseOverLogoRef.current && !hasDraggedRef.current && !isDragging) {
        window.open('https://www.linkedin.com/in/james-li-997439246/', '_blank', 'noopener,noreferrer')
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
    
    // --- Canvas & Logo Drawing ---
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = resolution
    canvas.height = resolution
    const blueHex = '#0077b5'
    
    ctx.fillStyle = 'black' 
    ctx.fillRect(0, 0, resolution, resolution)
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(resolution / 2, resolution / 2, resolution / 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = blueHex
    ctx.font = `bold ${resolution * 0.55}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('in', resolution / 2, resolution / 2 + (resolution * 0.05))
    
    const data = ctx.getImageData(0, 0, resolution, resolution).data
    const center = (resolution * gap) / 2 - gap / 2
    
    // Colors boosted for Bloom
    const cBlueText = new THREE.Color(blueHex).multiplyScalar(1.5)
    const cWhite = new THREE.Color('#ffffff').multiplyScalar(1.5)

    for (let x = 0; x < resolution; x++) {
      for (let y = 0; y < resolution; y++) {
        const canvasY = resolution - 1 - y
        const index = (canvasY * resolution + x) * 4
        
        const r = data[index]
        const b = data[index + 2]
        const isWhitePixel = r > 100;
        const isBluePixel = !isWhitePixel && b > 100;

        // Skip background
        if (!isWhitePixel && !isBluePixel) continue;

        for (let z = 0; z < resolution; z++) {
          
          // VOLUME LOGIC:
          // We only generate particles in the FRONT half (z > 30)
          const isVolume = z > resolution - 30;

          if (isVolume) {
            let multiplier = 1;
            if (isWhitePixel) {
                if (Math.random() > 0.12) continue; 
                multiplier = 1; 
            } else if (isBluePixel) {
                multiplier = 2; 
            }

            const col = isWhitePixel ? cWhite : cBlueText

            for (let d = 0; d < multiplier; d++) {
                const jitter = isBluePixel ? 0.0 : 0.5;
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
                    isText: isBluePixel 
                })
            }
          }
        }
      }
    }
    
    // HITBOX MATH:
    // Total Grid Size
    const totalSize = resolution * gap;
    // Since we only used half the Z-depth (30 layers out of 60), 
    // the actual depth is half of totalSize.
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

      // Hover flash - only if mouse is actually over logo (reduced by 50%)
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

export default LinkedInParticleLogo


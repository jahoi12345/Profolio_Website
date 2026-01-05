import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, N8AO, Bloom } from '@react-three/postprocessing'
import LinkedInParticleLogo from '../three/LinkedInParticleLogo'
import GitHubParticleLogo from '../three/GitHubParticleLogo'
import * as THREE from 'three'

// Shared state to track which logo is currently being dragged
let activeDragId = null

// Component to handle independent mouse drag rotation for each logo
const DraggableRotatingGroup = ({ children, reverse = false, isHovered = false, onDragChange, logoId, onDragStateChange }) => {
  const groupRef = useRef()
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const rotationX = useRef(0)
  const rotationY = useRef(0)
  // Velocity for momentum
  const velocityX = useRef(0)
  const velocityY = useRef(0)
  const hasMoved = useRef(false)
  // Natural spin animation - continuous rotation (200% slower)
  const naturalSpinSpeed = useRef(reverse ? -0.1 : 0.1) // Rotation speed in radians per second
  const { gl } = useThree()

  useEffect(() => {
    const handleMouseDown = (event) => {
      // Only allow this logo to start dragging if no other logo is dragging
      if (activeDragId !== null && activeDragId !== logoId) return
      
      // Reset movement flag
      hasMoved.current = false
      
      // Claim this drag session
      activeDragId = logoId
      
      // If hovering over logo, don't start drag immediately - wait to see if it's a click or drag
      // If not hovering, also wait for movement threshold before starting drag
      isDragging.current = false
      
      // Reset velocity when starting new drag
      velocityX.current = 0
      velocityY.current = 0
      previousMousePosition.current = {
        x: event.clientX,
        y: event.clientY
      }
    }

    const handleMouseMove = (event) => {
      // Only process if THIS logo is the active one
      if (activeDragId !== logoId || !groupRef.current) return

      const deltaX = event.clientX - previousMousePosition.current.x
      const deltaY = event.clientY - previousMousePosition.current.y
      const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // Track that mouse has moved
      hasMoved.current = true

      // Movement threshold to distinguish click from drag
      const dragThreshold = 5 // pixels
      
      // If moved beyond threshold, start dragging
      if (moveDistance > dragThreshold && !isDragging.current) {
        isDragging.current = true
        if (onDragChange) onDragChange(true)
        if (onDragStateChange) onDragStateChange(true)
      }

      // Only apply rotation if actually dragging
      if (!isDragging.current) {
        return
      }

      // Skip if movement is too small (prevents jitter)
      if (Math.abs(deltaX) < 0.1 && Math.abs(deltaY) < 0.1) {
        return
      }

      // Apply rotation based on mouse movement
      // Reverse direction if reverse prop is true
      const rotationSpeed = reverse ? -0.01 : 0.01
      const rotationDeltaY = deltaX * rotationSpeed
      const rotationDeltaX = -deltaY * rotationSpeed
      
      rotationY.current += rotationDeltaY
      rotationX.current += rotationDeltaX

      // Track velocity for momentum (use immediate velocity, not smoothed during drag)
      // Smoothing causes lag during active drag
      velocityY.current = rotationDeltaY
      velocityX.current = rotationDeltaX

      // Update group rotation immediately for smooth dragging
      groupRef.current.rotation.y = rotationY.current
      groupRef.current.rotation.x = rotationX.current

      previousMousePosition.current = {
        x: event.clientX,
        y: event.clientY
      }
    }

    const handleMouseUp = () => {
      // Only release if THIS logo was the active one
      if (activeDragId === logoId) {
        const wasDragging = isDragging.current
        isDragging.current = false
        activeDragId = null
        hasMoved.current = false
        
        if (wasDragging) {
          if (onDragChange) onDragChange(false)
          if (onDragStateChange) onDragStateChange(false)
        }
      }
    }

    gl.domElement.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      // Release drag if this component unmounts while dragging
      if (activeDragId === logoId) {
        activeDragId = null
      }
    }
  }, [gl, reverse, isHovered, onDragChange, onDragStateChange, logoId])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    // During drag, rotation is updated directly in handleMouseMove
    // Only apply momentum and natural spin when NOT dragging
    if (!isDragging.current) {
      // Apply momentum from drag (after drag ends)
      const damping = 0.92 // Friction coefficient (0.92 = 8% loss per frame)
      velocityY.current *= damping
      velocityX.current *= damping
      
      // Apply velocity to rotation
      rotationY.current += velocityY.current * delta * 60 // Scale by delta and normalize to 60fps
      rotationX.current += velocityX.current * delta * 60
      
      // Stop very small velocities
      if (Math.abs(velocityY.current) < 0.001) velocityY.current = 0
      if (Math.abs(velocityX.current) < 0.001) velocityX.current = 0
      
      // Apply natural spin - continuous rotation
      rotationY.current += naturalSpinSpeed.current * delta
    }
    
    // Update group rotation (only when not dragging, since dragging updates it directly)
    groupRef.current.rotation.y = rotationY.current
    groupRef.current.rotation.x = rotationX.current
  })
  

  return <group ref={groupRef}>{children}</group>
}

const Websites = () => {
  const [linkedInHovered, setLinkedInHovered] = useState(false)
  const [gitHubHovered, setGitHubHovered] = useState(false)
  const [isAnyDragging, setIsAnyDragging] = useState(false)
  const [linkedInDragging, setLinkedInDragging] = useState(false)
  const [gitHubDragging, setGitHubDragging] = useState(false)
  
  // Manage cursor at parent level to avoid conflicts
  useEffect(() => {
    const canvases = document.querySelectorAll('canvas')
    canvases.forEach(canvas => {
      if (isAnyDragging) {
        canvas.style.cursor = 'grabbing'
      } else if (linkedInHovered || gitHubHovered) {
        canvas.style.cursor = 'grab'
      } else {
        canvas.style.cursor = 'default'
      }
    })
  }, [linkedInHovered, gitHubHovered, isAnyDragging])

  return (
    <section
      id="websites"
      className="min-h-screen py-20 px-10 max-w-[1600px] mx-auto"
    >
      {/* Title and Subtitle - Centered on Top */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4">
          Websites
        </h2>
        <p className="text-text-dim text-lg">
          Interactive web experiences built with modern technologies and creative design.
        </p>
      </div>

      {/* Three.js Visual - Two Independent Containers */}
      <div className="h-[600px] w-full flex">
        {/* Left Container - LinkedIn Logo */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <Canvas shadows gl={{ antialias: false }} camera={{ position: [0, 0, 50], fov: 35 }}>
            <color attach="background" args={['#0a0a0a']} />
            
            {/* Lighting */}
            <ambientLight intensity={1.5} />
            <spotLight position={[-10, 20, 20]} angle={0.15} penumbra={1} decay={0} intensity={2} castShadow />
            <pointLight position={[0, 0, -20]} intensity={2} color="#ffffff" />
            
            {/* LinkedIn Logo - Centered in its container */}
            <DraggableRotatingGroup 
              reverse={false} 
              isHovered={linkedInHovered}
              onDragChange={setIsAnyDragging}
              onDragStateChange={setLinkedInDragging}
              logoId="linkedin"
            >
              <LinkedInParticleLogo 
                resolution={60} 
                gap={0.45} 
                intensity={2} 
                displacement={6} 
                speed={0.3}
                onHoverChange={setLinkedInHovered}
                isDragging={linkedInDragging}
              />
            </DraggableRotatingGroup>
            
            {/* Post-Processing Effects */}
            <EffectComposer disableNormalPass>
              <N8AO aoRadius={0.5} intensity={1} />
              <Bloom 
                mipmapBlur 
                luminanceThreshold={1.1} 
                levels={7} 
                intensity={linkedInHovered ? 0.08 : 0.02} 
              />
            </EffectComposer>
          </Canvas>
        </div>

        {/* Right Container - GitHub Logo */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <Canvas shadows gl={{ antialias: false }} camera={{ position: [0, 0, 50], fov: 35 }}>
            <color attach="background" args={['#0a0a0a']} />
            
            {/* Lighting */}
            <ambientLight intensity={1.5} />
            <spotLight position={[-10, 20, 20]} angle={0.15} penumbra={1} decay={0} intensity={2} castShadow />
            <pointLight position={[0, 0, -20]} intensity={2} color="#ffffff" />
            
            {/* GitHub Logo - Centered in its container, scaled down */}
            <group scale={0.894}>
              <DraggableRotatingGroup 
                reverse={true} 
                isHovered={gitHubHovered}
                onDragChange={setIsAnyDragging}
                onDragStateChange={setGitHubDragging}
                logoId="github"
              >
                <GitHubParticleLogo 
                  resolution={70} 
                  gap={0.4} 
                  intensity={2} 
                  displacement={6} 
                  speed={0.3}
                  onHoverChange={setGitHubHovered}
                  isDragging={gitHubDragging}
                />
              </DraggableRotatingGroup>
            </group>
            
            {/* Post-Processing Effects */}
            <EffectComposer disableNormalPass>
              <N8AO aoRadius={0.5} intensity={1} />
              <Bloom 
                mipmapBlur 
                luminanceThreshold={1.1} 
                levels={7} 
                intensity={gitHubHovered ? 0.08 : 0.02} 
              />
            </EffectComposer>
          </Canvas>
        </div>
      </div>
    </section>
  );
};

export default Websites;


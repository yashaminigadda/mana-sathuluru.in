import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function Emblem3D({ className = '', size = 'normal' }) {
  const containerRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth || 300
    let height = container.clientHeight || 300

    // SCENE & CAMERA
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100)
    camera.position.set(0, 0, 8.0)

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    container.appendChild(renderer.domElement)

    // WARM GOLDEN LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 2.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffe599, 3.2)
    keyLight.position.set(3, 5, 8)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xe8972e, 1.8)
    fillLight.position.set(-4, -3, 5)
    scene.add(fillLight)

    // PIVOT GROUP FOR 3D EMBLEM
    const emblemGroup = new THREE.Group()
    scene.add(emblemGroup)

    // TEXTURE EXTRACTION CANVAS: Extract circle from public/mana-sathuluru-full.jpg
    const img = new Image()
    img.src = '/mana-sathuluru-full.jpg'
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      // 1. High-Res Canvas for Front Face
      const canvas = document.createElement('canvas')
      canvas.width = 512
      canvas.height = 512
      const ctx = canvas.getContext('2d')

      const cx = (img.width || 458) * 0.5
      const cy = (img.height || 1024) * 0.485
      const r = (img.width || 458) * 0.33

      ctx.clearRect(0, 0, 512, 512)

      // Clip as perfect circle
      ctx.save()
      ctx.beginPath()
      ctx.arc(256, 256, 252, 0, Math.PI * 2)
      ctx.clip()

      // Draw image perfectly vertical
      ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2, 0, 0, 512, 512)
      ctx.restore()

      // Vibrant Radiant Gold Neon Halo Border
      ctx.save()
      ctx.beginPath()
      ctx.arc(256, 256, 248, 0, Math.PI * 2)
      ctx.lineWidth = 14
      ctx.strokeStyle = '#fbbf24'
      ctx.shadowColor = '#f59e0b'
      ctx.shadowBlur = 20
      ctx.stroke()
      ctx.restore()

      const frontTexture = new THREE.CanvasTexture(canvas)
      frontTexture.generateMipmaps = true
      frontTexture.minFilter = THREE.LinearMipmapLinearFilter
      frontTexture.anisotropy = 8

      // 2. High-Res Canvas for Back Face
      const backCanvas = document.createElement('canvas')
      backCanvas.width = 512
      backCanvas.height = 512
      const bCtx = backCanvas.getContext('2d')

      bCtx.fillStyle = '#0a0d14'
      bCtx.fillRect(0, 0, 512, 512)

      bCtx.beginPath()
      bCtx.arc(256, 256, 240, 0, Math.PI * 2)
      bCtx.lineWidth = 10
      bCtx.strokeStyle = '#f59e0b'
      bCtx.stroke()

      bCtx.fillStyle = '#fef08a'
      bCtx.font = 'bold 36px serif'
      bCtx.textAlign = 'center'
      bCtx.fillText('మన సాతులూరు', 256, 180)

      bCtx.fillStyle = '#f59e0b'
      bCtx.font = 'bold 72px serif'
      bCtx.fillText('MS', 256, 265)

      bCtx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      bCtx.font = 'italic 20px serif'
      bCtx.fillText('Our Village • Our Pride', 256, 330)

      const backTexture = new THREE.CanvasTexture(backCanvas)

      // 3. 3D DISC WITH RADIANT GLOW
      const radius = size === 'small' ? 1.9 : size === 'large' ? 2.8 : 2.35
      const depth = 0.16

      // Golden Metallic Rim
      const bodyGeo = new THREE.CylinderGeometry(radius, radius, depth, 64, 1, true)
      bodyGeo.rotateX(Math.PI / 2)
      const rimMat = new THREE.MeshStandardMaterial({
        color: 0xf5b026,
        metalness: 0.95,
        roughness: 0.2,
        emissive: 0xd97706,
        emissiveIntensity: 0.4,
        side: THREE.DoubleSide
      })
      const bodyMesh = new THREE.Mesh(bodyGeo, rimMat)
      emblemGroup.add(bodyMesh)

      // Front Face Disc
      const frontGeo = new THREE.CircleGeometry(radius, 64)
      const frontMat = new THREE.MeshStandardMaterial({
        map: frontTexture,
        metalness: 0.05,
        roughness: 0.35,
        side: THREE.FrontSide
      })
      const frontMesh = new THREE.Mesh(frontGeo, frontMat)
      frontMesh.position.z = depth / 2
      emblemGroup.add(frontMesh)

      // Back Face Disc
      const backGeo = new THREE.CircleGeometry(radius, 64)
      backGeo.rotateY(Math.PI)
      const backMat = new THREE.MeshStandardMaterial({
        map: backTexture,
        metalness: 0.3,
        roughness: 0.4,
        side: THREE.FrontSide
      })
      const backMesh = new THREE.Mesh(backGeo, backMat)
      backMesh.position.z = -depth / 2
      emblemGroup.add(backMesh)

      // Glass Gloss Specular Layer
      const glintGeo = new THREE.CircleGeometry(radius * 0.99, 48)
      const glintMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending
      })
      const glintMesh = new THREE.Mesh(glintGeo, glintMat)
      glintMesh.position.z = depth / 2 + 0.005
      emblemGroup.add(glintMesh)

      setIsLoaded(true)
    }

    // INTERACTION: MOUSE & TOUCH TILT
    let mouseX = 0
    let mouseY = 0
    let targetRotX = 0
    let targetRotY = 0
    let bounceSpring = 0
    let bounceVelocity = 0

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouseX = THREE.MathUtils.clamp(x, -1, 1) * 0.22
      mouseY = THREE.MathUtils.clamp(y, -1, 1) * 0.18
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0]
        const rect = container.getBoundingClientRect()
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1)
        mouseX = THREE.MathUtils.clamp(x, -1, 1) * 0.18
        mouseY = THREE.MathUtils.clamp(y, -1, 1) * 0.14
      }
    }

    const handlePointerLeave = () => {
      mouseX = 0
      mouseY = 0
    }

    container.addEventListener('mousemove', handlePointerMove)
    container.addEventListener('mouseleave', handlePointerLeave)
    container.addEventListener('touchmove', handleTouchMove, { passive: true })

    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || 300
      height = container.clientHeight || 300
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    // ANIMATION LOOP
    let animationFrameId
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Subtle float bob
      emblemGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.08

      // Spring physics on click
      bounceVelocity += (-bounceSpring * 0.15)
      bounceVelocity *= 0.85
      bounceSpring += bounceVelocity

      targetRotY = mouseX
      targetRotX = -mouseY

      emblemGroup.rotation.y += (targetRotY - emblemGroup.rotation.y) * 0.08
      emblemGroup.rotation.x += (targetRotX - emblemGroup.rotation.x) * 0.08
      emblemGroup.rotation.z = 0

      const currentScale = 1 + bounceSpring
      emblemGroup.scale.set(currentScale, currentScale, currentScale)

      renderer.render(scene, camera)
    }

    animate()

    const handleClick = () => {
      bounceVelocity = 0.08
    }

    container.addEventListener('click', handleClick)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handlePointerMove)
      container.removeEventListener('mouseleave', handlePointerLeave)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('click', handleClick)

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [size])

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Golden Neon Halo Glow (Matching the user's mockup) */}
      <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-2xl pointer-events-none scale-110" />
      <div className="absolute inset-4 rounded-full border border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.6)] pointer-events-none" />

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 cursor-pointer relative select-none"
        title="Mana Sathuluru Glowing 3D Emblem"
      />
    </div>
  )
}

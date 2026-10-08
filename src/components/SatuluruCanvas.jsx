import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function SatuluruCanvas() {
  const containerRef = useRef(null)
  const [webGLSupported, setWebGLSupported] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Verify WebGL availability
    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setWebGLSupported(false)
        return
      }
    } catch (e) {
      setWebGLSupported(false)
      return
    }

    const isMobile = window.innerWidth < 768

    // SCENE SETUP
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x06080d)
    scene.fog = new THREE.FogExp2(0x06080d, isMobile ? 0.022 : 0.018)

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 62 : 55,
      container.clientWidth / container.clientHeight,
      0.1,
      280
    )
    camera.position.set(0, isMobile ? 4.6 : 4.2, isMobile ? 30 : 28)
    camera.lookAt(0, 3.2, 0)

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x272b38, 1.2)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xf5a432, 2.6)
    sunLight.position.set(2, 6, -35)
    scene.add(sunLight)

    const warmFill = new THREE.PointLight(0xe8972e, 1.8, 45)
    warmFill.position.set(0, 3, 10)
    scene.add(warmFill)

    const templeLight = new THREE.PointLight(0xffbe59, 2.0, 35)
    templeLight.position.set(-6, 7, -18)
    scene.add(templeLight)

    // SCENERY GROUP
    const worldGroup = new THREE.Group()
    scene.add(worldGroup)

    // 1. SUN SPHERE AT HORIZON
    const sunGeo = new THREE.SphereGeometry(isMobile ? 4.0 : 4.5, 24, 24)
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xfcb034,
      transparent: true,
      opacity: 0.88
    })
    const sunMesh = new THREE.Mesh(sunGeo, sunMat)
    sunMesh.position.set(1.5, 7.5, -60)
    worldGroup.add(sunMesh)

    // Sun outer halo
    const haloGeo = new THREE.RingGeometry(4.5, 12, 24)
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    })
    const haloMesh = new THREE.Mesh(haloGeo, haloMat)
    haloMesh.position.copy(sunMesh.position)
    haloMesh.position.z += 0.1
    worldGroup.add(haloMesh)

    // 2. ROLLING VILLAGE TERRAIN (Left & Right Fields)
    const terrainSubdiv = isMobile ? 28 : 44
    const terrainGeo = new THREE.PlaneGeometry(80, 100, terrainSubdiv, terrainSubdiv)
    terrainGeo.rotateX(-Math.PI / 2)

    const pos = terrainGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const distFromCenter = Math.abs(x)
      let y = 0

      if (distFromCenter < 3.2) {
        y = -0.15 + Math.sin(z * 0.1) * 0.08
      } else {
        const wave = Math.sin(x * 0.15) * Math.cos(z * 0.08) * 1.6
        const ridge = Math.min(3.5, (distFromCenter - 3.2) * 0.4 + wave)
        y = ridge
      }
      pos.setY(i, y)
    }
    terrainGeo.computeVertexNormals()

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0f1c16,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: true
    })
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat)
    terrainMesh.position.set(0, 0, -10)
    worldGroup.add(terrainMesh)

    // 3. VILLAGE ROAD / WINDING PATH
    const roadGeo = new THREE.PlaneGeometry(5.2, 95, 16, 36)
    roadGeo.rotateX(-Math.PI / 2)
    const roadPos = roadGeo.attributes.position
    for (let i = 0; i < roadPos.count; i++) {
      const z = roadPos.getZ(i)
      const curve = Math.sin(z * 0.08) * 1.2
      roadPos.setX(i, roadPos.getX(i) + curve)
      roadPos.setY(i, -0.05)
    }
    roadGeo.computeVertexNormals()

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x221a14,
      roughness: 0.95,
      metalness: 0.02
    })
    const roadMesh = new THREE.Mesh(roadGeo, roadMat)
    roadMesh.position.set(0, 0.02, -10)
    worldGroup.add(roadMesh)

    // 4. TEMPLE SILHOUETTE (Gopuram)
    const templeGroup = new THREE.Group()
    templeGroup.position.set(-8.5, 0.8, -24)

    const tiers = 5
    for (let t = 0; t < tiers; t++) {
      const tierWidth = 4.2 - t * 0.65
      const tierHeight = 1.3
      const tierDepth = 3.6 - t * 0.55
      const tierGeo = new THREE.BoxGeometry(tierWidth, tierHeight, tierDepth)
      const tierMat = new THREE.MeshStandardMaterial({
        color: 0x12151c,
        roughness: 0.85
      })
      const tierMesh = new THREE.Mesh(tierGeo, tierMat)
      tierMesh.position.y = t * 1.2 + 0.65
      templeGroup.add(tierMesh)
    }

    const kalasamGeo = new THREE.ConeGeometry(0.35, 1.8, 10)
    const kalasamMat = new THREE.MeshStandardMaterial({
      color: 0xf5b026,
      emissive: 0xd98216,
      emissiveIntensity: 0.7,
      roughness: 0.3,
      metalness: 0.8
    })
    const kalasam = new THREE.Mesh(kalasamGeo, kalasamMat)
    kalasam.position.y = tiers * 1.2 + 1.2
    templeGroup.add(kalasam)

    const orbGeo = new THREE.SphereGeometry(0.2, 8, 8)
    const orbMat = new THREE.MeshBasicMaterial({ color: 0xffd269 })
    const orb = new THREE.Mesh(orbGeo, orbMat)
    orb.position.y = kalasam.position.y + 1.0
    templeGroup.add(orb)
    worldGroup.add(templeGroup)

    // 5. TRADITIONAL COTTAGES / HUTS
    const hutPositions = [
      { x: 5.8, z: -12, scale: 1.1, rotY: -0.3 },
      { x: 7.8, z: -20, scale: 1.3, rotY: -0.5 },
      { x: -5.5, z: -14, scale: 0.95, rotY: 0.4 },
      { x: 9.5, z: -32, scale: 1.4, rotY: -0.2 },
      { x: -11.5, z: -36, scale: 1.5, rotY: 0.3 },
    ]

    hutPositions.forEach(posItem => {
      const hut = new THREE.Group()
      hut.position.set(posItem.x, 0.4, posItem.z)
      hut.rotation.y = posItem.rotY
      hut.scale.setScalar(posItem.scale)

      const wallGeo = new THREE.BoxGeometry(2.4, 1.6, 2.0)
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x141820,
        roughness: 0.9
      })
      const wallMesh = new THREE.Mesh(wallGeo, wallMat)
      wallMesh.position.y = 0.8
      hut.add(wallMesh)

      const roofGeo = new THREE.ConeGeometry(2.1, 1.3, 4)
      roofGeo.rotateY(Math.PI / 4)
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x3d2018,
        roughness: 0.85
      })
      const roofMesh = new THREE.Mesh(roofGeo, roofMat)
      roofMesh.position.y = 2.1
      hut.add(roofMesh)

      const winGeo = new THREE.PlaneGeometry(0.4, 0.4)
      const winMat = new THREE.MeshBasicMaterial({
        color: 0xf5a432,
        side: THREE.DoubleSide
      })
      const winMesh = new THREE.Mesh(winGeo, winMat)
      winMesh.position.set(0, 0.8, 1.01)
      hut.add(winMesh)

      worldGroup.add(hut)
    })

    // 6. PALM TREES & FLORA
    const createPalmTree = (x, z, scale = 1, lean = 0.1) => {
      const palm = new THREE.Group()
      palm.position.set(x, 0.3, z)
      palm.scale.setScalar(scale)

      const trunkPoints = []
      const height = 7.5
      for (let i = 0; i <= 5; i++) {
        const t = i / 5
        trunkPoints.push(new THREE.Vector3(Math.sin(t * 1.5) * lean * 3, t * height, 0))
      }
      const trunkGeo = new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(trunkPoints),
        10,
        0.18,
        6,
        false
      )
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x1b1612,
        roughness: 0.95
      })
      const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat)
      palm.add(trunkMesh)

      const frondCount = isMobile ? 6 : 8
      const frondMat = new THREE.MeshStandardMaterial({
        color: 0x102419,
        roughness: 0.8,
        side: THREE.DoubleSide
      })
      for (let f = 0; f < frondCount; f++) {
        const angle = (f / frondCount) * Math.PI * 2
        const frondGroup = new THREE.Group()
        frondGroup.position.set(Math.sin(1.5) * lean * 3, height, 0)
        frondGroup.rotation.y = angle
        frondGroup.rotation.z = 0.55 + (f % 2) * 0.1

        const bladeGeo = new THREE.PlaneGeometry(0.5, 3.2, 2, 4)
        bladeGeo.translate(0, 1.6, 0)
        const bladeMesh = new THREE.Mesh(bladeGeo, frondMat)
        bladeMesh.rotation.x = 0.2
        frondGroup.add(bladeMesh)

        palm.add(frondGroup)
      }

      return palm
    }

    const palmLocations = [
      { x: -4.8, z: -8, scale: 1.0, lean: 0.08 },
      { x: -7.5, z: -16, scale: 1.25, lean: -0.1 },
      { x: -12.0, z: -28, scale: 1.4, lean: 0.06 },
      { x: 4.8, z: -9, scale: 1.05, lean: -0.07 },
      { x: 8.5, z: -15, scale: 1.3, lean: 0.12 },
      { x: 13.0, z: -26, scale: 1.5, lean: -0.08 },
    ]

    palmLocations.forEach(p => {
      worldGroup.add(createPalmTree(p.x, p.z, p.scale, p.lean))
    })

    // 7. FLOATING GOLDEN PARTICLES (Fireflies / Sunset dust motes)
    const particleCount = isMobile ? 120 : 260
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleSpeeds = new Float32Array(particleCount)
    const particleOffsets = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      particlePositions[i3] = (Math.random() - 0.5) * 45
      particlePositions[i3 + 1] = 0.5 + Math.random() * 12
      particlePositions[i3 + 2] = -50 + Math.random() * 65
      particleSpeeds[i] = 0.2 + Math.random() * 0.5
      particleOffsets[i] = Math.random() * Math.PI * 2
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const createParticleTexture = () => {
      const pCanvas = document.createElement('canvas')
      pCanvas.width = 64
      pCanvas.height = 64
      const pCtx = pCanvas.getContext('2d')
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
      grad.addColorStop(0, 'rgba(255, 220, 130, 1)')
      grad.addColorStop(0.35, 'rgba(235, 170, 50, 0.65)')
      grad.addColorStop(1, 'rgba(235, 170, 50, 0)')
      pCtx.fillStyle = grad
      pCtx.beginPath()
      pCtx.arc(32, 32, 32, 0, Math.PI * 2)
      pCtx.fill()
      return new THREE.CanvasTexture(pCanvas)
    }

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.45 : 0.55,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85
    })

    const particleSystem = new THREE.Points(particleGeo, particleMat)
    worldGroup.add(particleSystem)

    // INTERACTION LISTENERS (Mouse + Touch)
    let mouseX = 0
    let mouseY = 0
    let targetCameraX = 0
    let targetCameraY = isMobile ? 4.6 : 4.2
    let scrollY = 0

    const handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = -(e.clientY / window.innerHeight) * 2 + 1
      mouseX = normX * 1.8
      mouseY = normY * 0.9
    }

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const touch = e.touches[0]
        const normX = (touch.clientX / window.innerWidth) * 2 - 1
        const normY = -(touch.clientY / window.innerHeight) * 2 + 1
        mouseX = normX * 1.2
        mouseY = normY * 0.6
      }
    }

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset
    }

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // ANIMATION LOOP
    let animationFrameId
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Float and oscillate golden particles
      const positions = particleGeo.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        positions[i3 + 1] += Math.sin(elapsedTime * particleSpeeds[i] + particleOffsets[i]) * 0.012
        positions[i3] += Math.cos(elapsedTime * 0.3 + particleOffsets[i]) * 0.006

        if (positions[i3 + 1] > 14) positions[i3 + 1] = 0.5
        if (positions[i3 + 1] < 0.2) positions[i3 + 1] = 13.5
      }
      particleGeo.attributes.position.needsUpdate = true

      // Gentle sun pulse
      const sunPulse = 1 + Math.sin(elapsedTime * 1.2) * 0.03
      sunMesh.scale.set(sunPulse, sunPulse, sunPulse)

      // Smooth camera lerp
      const scrollFactor = Math.min(scrollY / 1000, 1.5)
      targetCameraX = mouseX
      targetCameraY = (isMobile ? 4.6 : 4.2) + mouseY + scrollFactor * 1.2
      const targetCameraZ = (isMobile ? 30 : 28) - scrollFactor * 6.5

      camera.position.x += (targetCameraX - camera.position.x) * 0.04
      camera.position.y += (targetCameraY - camera.position.y) * 0.04
      camera.position.z += (targetCameraZ - camera.position.z) * 0.04

      camera.lookAt(targetCameraX * 0.3, 3.2 + scrollFactor * 0.8, -10)

      renderer.render(scene, camera)
      if (!isLoaded) {
        setIsLoaded(true)
      }
    }

    animate()

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }

      sunGeo.dispose()
      sunMat.dispose()
      haloGeo.dispose()
      haloMat.dispose()
      terrainGeo.dispose()
      terrainMat.dispose()
      roadGeo.dispose()
      roadMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [])

  if (!webGLSupported) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#0a0f1d] via-[#120f12] to-[#060709] flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,164,50,0.18)_0%,transparent_60%)]" />
        <svg
          className="absolute bottom-0 w-full opacity-40 text-emerald-950 pointer-events-none"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,192L48,208C96,224,192,256,288,245.3C384,235,480,181,576,170.7C672,160,768,192,864,208C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z"
          />
        </svg>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  )
}

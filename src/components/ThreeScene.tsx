import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EXHIBIT_ITEMS, ExhibitItem } from '../data/exhibits';
import {
  createBronzeDrumTexture,
  createWoodFloorTexture,
  createRedCarpetTexture,
  createLotusWallBanner,
} from '../utils/textures';
import { soundCtrl } from '../utils/audio';

export type CameraPreset = 'overview' | 'altar' | 'zone1' | 'zone2' | 'zone3' | 'zone4';

interface ThreeSceneProps {
  onSelectExhibit: (exhibit: ExhibitItem) => void;
  activePreset: CameraPreset;
  offeredFlowersCount: number;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({
  onSelectExhibit,
  activePreset,
  offeredFlowersCount,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.8, 9.5));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.8, -2));
  const flowersGroupRef = useRef<THREE.Group | null>(null);

  // Update target camera positions when preset changes
  useEffect(() => {
    switch (activePreset) {
      case 'overview':
        targetCamPosRef.current.set(0, 3.8, 9.8);
        targetLookAtRef.current.set(0, 1.8, -2.5);
        break;
      case 'altar':
        targetCamPosRef.current.set(0, 2.3, -4.5);
        targetLookAtRef.current.set(0, 2.5, -8.2);
        break;
      case 'zone1': // Left - Thiếu nhi
        targetCamPosRef.current.set(-2.5, 2.1, 0);
        targetLookAtRef.current.set(-6.5, 1.8, 0);
        break;
      case 'zone2': // Left-Rear - Hành trình
        targetCamPosRef.current.set(-1.5, 2.3, -3.5);
        targetLookAtRef.current.set(-5.5, 2.1, -7.0);
        break;
      case 'zone3': // Right - Đạo đức
        targetCamPosRef.current.set(2.5, 2.1, 0);
        targetLookAtRef.current.set(6.5, 1.8, 0);
        break;
      case 'zone4': // Rear/Back - Hiện vật
        targetCamPosRef.current.set(0, 2.0, 2.8);
        targetLookAtRef.current.set(0, 1.7, 6.5);
        break;
    }
  }, [activePreset]);

  // Update virtual offered flowers count on the altar table
  useEffect(() => {
    if (!flowersGroupRef.current) return;
    const group = flowersGroupRef.current;
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
    }

    const count = Math.min(offeredFlowersCount, 24);
    const colors = [0xff69b4, 0xff1493, 0xffd700, 0xffffff, 0xf472b6];

    for (let i = 0; i < count; i++) {
      const petalGeo = new THREE.ConeGeometry(0.12, 0.22, 5);
      const color = colors[i % colors.length];
      const petalMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.1,
      });

      const flower = new THREE.Group();
      for (let p = 0; p < 6; p++) {
        const pMesh = new THREE.Mesh(petalGeo, petalMat);
        pMesh.rotation.z = Math.PI / 4;
        pMesh.rotation.y = (p * Math.PI) / 3;
        flower.add(pMesh);
      }

      // Arrange in concentric rows on the offering tray
      const row = Math.floor(i / 8);
      const col = i % 8;
      const x = (col - 3.5) * 0.28;
      const z = (row - 1) * 0.22;
      flower.position.set(x, 1.25, -7.3 + z);
      flower.scale.set(0.9, 0.7, 0.9);
      group.add(flower);
    }
  }, [offeredFlowersCount]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#1e1b18');
    scene.fog = new THREE.FogExp2('#1e1b18', 0.028);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      80
    );
    camera.position.set(0, 3.8, 9.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Environment reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.0;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go below floor
    controls.minPolarAngle = 0.2;
    controls.target.set(0, 1.8, -2.5);

    // --- LIGHTING RIG ---
    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.2);
    keyLight.position.set(5, 7, 5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.shadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Soft sky-ground hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0x3e2723, 1.2);
    scene.add(hemiLight);

    // Altar Spotlight (Golden aura on Uncle Ho's bust)
    const altarSpot = new THREE.SpotLight(0xfff0b3, 3.5, 14, Math.PI / 5, 0.4, 1.2);
    altarSpot.position.set(0, 5.8, -4.5);
    altarSpot.target.position.set(0, 2.2, -8.2);
    scene.add(altarSpot);
    scene.add(altarSpot.target);

    // Warm room chandeliers (4 points)
    const chandelierPositions: [number, number, number][] = [
      [-4.5, 4.8, -3],
      [4.5, 4.8, -3],
      [-4.5, 4.8, 3],
      [4.5, 4.8, 3],
    ];

    chandelierPositions.forEach(([cx, cy, cz]) => {
      const pLight = new THREE.PointLight(0xffe4b5, 0.9, 9, 1.5);
      pLight.position.set(cx, cy, cz);
      scene.add(pLight);

      // Chandelier 3D mesh
      const chGroup = new THREE.Group();
      chGroup.position.set(cx, cy, cz);
      const chRod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 1.2),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 })
      );
      chRod.position.y = 0.6;
      chGroup.add(chRod);

      const chRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.45, 0.05, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 })
      );
      chRing.rotation.x = Math.PI / 2;
      chGroup.add(chRing);

      const bulbGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
      const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
      chGroup.add(bulbMesh);

      scene.add(chGroup);
    });

    // --- ROOM ARCHITECTURE ---
    const roomWidth = 18;
    const roomHeight = 6.2;
    const roomDepth = 20;

    // Floor (Wood Parquet)
    const floorTexture = createWoodFloorTexture();
    const floorGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.35,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Red Carpet Runner
    const carpetTex = createRedCarpetTexture();
    const carpetGeo = new THREE.PlaneGeometry(3.6, 16);
    const carpetMat = new THREE.MeshStandardMaterial({
      map: carpetTex,
      roughness: 0.75,
      metalness: 0.02,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.02, 0);
    carpet.receiveShadow = !isSoftwareGl;
    scene.add(carpet);

    // Central Dong Son Bronze Drum Medallion (Trống Đồng)
    const bronzeDrumTex = createBronzeDrumTexture();
    const drumGeo = new THREE.CircleGeometry(2.2, 48);
    const drumMat = new THREE.MeshStandardMaterial({
      map: bronzeDrumTex,
      roughness: 0.35,
      metalness: 0.65,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -2,
    });
    const bronzeDrum = new THREE.Mesh(drumGeo, drumMat);
    bronzeDrum.rotation.x = -Math.PI / 2;
    bronzeDrum.position.set(0, 0.03, 0);
    scene.add(bronzeDrum);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f3,
      roughness: 0.85,
      metalness: 0.02,
    });
    const woodTrimMat = new THREE.MeshStandardMaterial({
      color: 0x5c2b0c,
      roughness: 0.4,
      metalness: 0.1,
    });

    // Front Wall (Z = -10)
    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
    frontWall.position.set(0, roomHeight / 2, -10);
    scene.add(frontWall);

    // Front Wall Wainscoting (Wood lower half)
    const frontWainscot = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, 1.4), woodTrimMat);
    frontWainscot.position.set(0, 0.7, -9.98);
    scene.add(frontWainscot);

    // Front Wall Main Cultural Banner
    const bannerTex = createLotusWallBanner();
    const bannerGeo = new THREE.PlaneGeometry(9.6, 2.2);
    const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex });
    const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
    bannerMesh.position.set(0, 4.6, -9.96);
    scene.add(bannerMesh);

    // Back Wall (Z = +10)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
    backWall.rotation.y = Math.PI;
    backWall.position.set(0, roomHeight / 2, 10);
    scene.add(backWall);

    // Back Wall Entrance Door Trim
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.2, 0.2), woodTrimMat);
    doorFrame.position.set(0, 2.1, 9.9);
    scene.add(doorFrame);

    // Left Wall (X = -9)
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-9, roomHeight / 2, 0);
    scene.add(leftWall);

    const leftWainscot = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, 1.4), woodTrimMat);
    leftWainscot.rotation.y = Math.PI / 2;
    leftWainscot.position.set(-8.98, 0.7, 0);
    scene.add(leftWainscot);

    // Right Wall (X = +9)
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(9, roomHeight / 2, 0);
    scene.add(rightWall);

    const rightWainscot = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, 1.4), woodTrimMat);
    rightWainscot.rotation.y = -Math.PI / 2;
    rightWainscot.position.set(8.98, 0.7, 0);
    scene.add(rightWainscot);

    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomDepth),
      new THREE.MeshStandardMaterial({ color: 0x422006, roughness: 0.6 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, roomHeight, 0);
    scene.add(ceiling);

    // --- MAIN MEMORIAL ALTAR (BÀN THỜ BÁC HỒ TẠI Z = -8.2) ---
    const altarGroup = new THREE.Group();
    altarGroup.position.set(0, 0, -8.2);

    // Multi-tier wooden altar table
    const tableBase = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.25, 1.6),
      woodTrimMat
    );
    tableBase.position.y = 0.125;
    altarGroup.add(tableBase);

    const tableBody = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.85, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35, metalness: 0.1 })
    );
    tableBody.position.y = 0.675;
    altarGroup.add(tableBody);

    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.15, 1.8),
      woodTrimMat
    );
    tableTop.position.y = 1.175;
    altarGroup.add(tableTop);

    // Golden trim on table edge
    const goldTrim = new THREE.Mesh(
      new THREE.BoxGeometry(4.44, 0.04, 1.84),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
    );
    goldTrim.position.y = 1.22;
    altarGroup.add(goldTrim);

    // Pedestal for the Bust
    const bustPedestal = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.55, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.4, metalness: 0.2 })
    );
    bustPedestal.position.set(0, 1.45, -0.2);
    altarGroup.add(bustPedestal);

    // Golden plaque with text
    const plaqueMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
    });
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.22, 0.05), plaqueMat);
    plaque.position.set(0, 1.45, 0.26);
    altarGroup.add(plaque);

    // Uncle Ho's Golden Bust Statue (/assets/aistudio/0_78d2b17c.png)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/assets/aistudio/0_78d2b17c.png', (bustTexture) => {
      bustTexture.colorSpace = THREE.SRGBColorSpace;
      const bustGeo = new THREE.PlaneGeometry(1.45, 1.55);
      const bustMat = new THREE.MeshStandardMaterial({
        map: bustTexture,
        transparent: true,
        alphaTest: 0.08,
        roughness: 0.25,
        metalness: 0.85,
        side: THREE.DoubleSide,
      });

      const bustMesh = new THREE.Mesh(bustGeo, bustMat);
      bustMesh.position.set(0, 2.5, -0.2);
      altarGroup.add(bustMesh);

      // Soft back halo / golden aura disc
      const haloGeo = new THREE.CircleGeometry(1.05, 36);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(0, 2.55, -0.25);
      altarGroup.add(haloMesh);
    });

    // Flanking National Flags (Cờ Đỏ Sao Vàng)
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.45,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.15,
    });

    [-2.2, 2.2].forEach((flagX) => {
      // Flagpole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.8, 16), poleMat);
      pole.position.set(flagX, 1.9, -0.3);
      altarGroup.add(pole);

      // Gold top sphere
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), poleMat);
      sphere.position.set(flagX, 3.8, -0.3);
      altarGroup.add(sphere);

      // Flag Cloth
      const clothGeo = new THREE.PlaneGeometry(1.2, 0.8, 10, 6);
      const cloth = new THREE.Mesh(clothGeo, flagMat);
      cloth.position.set(flagX + (flagX > 0 ? 0.6 : -0.6), 3.2, -0.3);
      altarGroup.add(cloth);

      // Gold Star in center
      const starShape = new THREE.Shape();
      const numPoints = 5;
      for (let i = 0; i < numPoints * 2; i++) {
        const r = i % 2 === 0 ? 0.2 : 0.08;
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        const sx = Math.cos(angle) * r;
        const sy = Math.sin(angle) * r;
        if (i === 0) starShape.moveTo(sx, sy);
        else starShape.lineTo(sx, sy);
      }
      const starGeo = new THREE.ShapeGeometry(starShape);
      const starMesh = new THREE.Mesh(starGeo, poleMat);
      starMesh.position.set(flagX + (flagX > 0 ? 0.6 : -0.6), 3.2, -0.28);
      altarGroup.add(starMesh);
    });

    // Incense Burner (Lư Hương Bằng Đồng)
    const burnerGroup = new THREE.Group();
    burnerGroup.position.set(0, 1.25, 0.35);

    const burnerBowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.22, 0.28, 24),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 })
    );
    burnerBowl.position.y = 0.14;
    burnerGroup.add(burnerBowl);

    // 3 incense sticks
    [-0.04, 0, 0.04].forEach((sx) => {
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.35),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      stick.position.set(sx, 0.38, 0);
      burnerGroup.add(stick);

      // Glowing tip
      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(0.012),
        new THREE.MeshBasicMaterial({ color: 0xffedd5 })
      );
      tip.position.set(sx, 0.55, 0);
      burnerGroup.add(tip);
    });

    altarGroup.add(burnerGroup);

    // Group for student offered lotus flowers
    const flowersGroup = new THREE.Group();
    altarGroup.add(flowersGroup);
    flowersGroupRef.current = flowersGroup;

    scene.add(altarGroup);

    // --- 3D EXHIBITION STANDS (INTERACTIVE MESHES) ---
    const interactiveMeshes: THREE.Object3D[] = [];
    const exhibitMeshMap = new Map<THREE.Object3D, ExhibitItem>();

    EXHIBIT_ITEMS.forEach((item) => {
      const standGroup = new THREE.Group();
      standGroup.position.set(item.position3D[0], item.position3D[1], item.position3D[2]);
      if (item.rotation3D) {
        standGroup.rotation.set(item.rotation3D[0], item.rotation3D[1], item.rotation3D[2]);
      }

      // Wooden Pedestal
      const baseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.12, 0.4),
        woodTrimMat
      );
      baseMesh.position.y = -item.position3D[1] + 0.06;
      standGroup.add(baseMesh);

      const pillarMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, item.position3D[1], 12),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4, metalness: 0.2 })
      );
      pillarMesh.position.y = (-item.position3D[1] + 0.06) / 2 + 0.1;
      standGroup.add(pillarMesh);

      // Gold Frame Board
      const frameGeo = new THREE.BoxGeometry(1.68, 1.28, 0.06);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.8,
        roughness: 0.2,
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      standGroup.add(frameMesh);

      // Image Canvas on Stand
      textureLoader.load(item.image, (imgTexture) => {
        imgTexture.colorSpace = THREE.SRGBColorSpace;
        const panelGeo = new THREE.PlaneGeometry(1.54, 1.14);
        const panelMat = new THREE.MeshBasicMaterial({
          map: imgTexture,
          side: THREE.FrontSide,
        });
        const panelMesh = new THREE.Mesh(panelGeo, panelMat);
        panelMesh.position.z = 0.035;
        standGroup.add(panelMesh);
      });

      // Interactive Click Target Box
      const hitBoxGeo = new THREE.BoxGeometry(1.7, 1.3, 0.3);
      const hitBoxMat = new THREE.MeshBasicMaterial({
        visible: false,
      });
      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      standGroup.add(hitBox);

      // Floating interactive badge above stand
      const badgeGeo = new THREE.PlaneGeometry(0.8, 0.22);
      const badgeCanvas = document.createElement('canvas');
      badgeCanvas.width = 256;
      badgeCanvas.height = 70;
      const bCtx = badgeCanvas.getContext('2d');
      if (bCtx) {
        bCtx.fillStyle = '#dc2626';
        bCtx.roundRect(4, 4, 248, 62, 16);
        bCtx.fill();
        bCtx.strokeStyle = '#fef08a';
        bCtx.lineWidth = 4;
        bCtx.stroke();
        bCtx.fillStyle = '#ffffff';
        bCtx.font = 'bold 24px sans-serif';
        bCtx.textAlign = 'center';
        bCtx.textBaseline = 'middle';
        bCtx.fillText('🔍 Xem chi tiết', 128, 35);
      }
      const badgeTex = new THREE.CanvasTexture(badgeCanvas);
      badgeTex.colorSpace = THREE.SRGBColorSpace;
      const badgeMesh = new THREE.Mesh(
        badgeGeo,
        new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true })
      );
      badgeMesh.position.set(0, 0.85, 0.05);
      standGroup.add(badgeMesh);

      // Register for raycasting
      interactiveMeshes.push(hitBox);
      exhibitMeshMap.set(hitBox, item);

      scene.add(standGroup);
    });

    // --- FLOATING LOTUS PETAL PARTICLES ---
    const petalCount = 45;
    const petalPositions = new Float32Array(petalCount * 3);
    const petalVelocities: { x: number; y: number; z: number; rotSpeed: number }[] = [];

    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 14;
      petalPositions[i * 3 + 1] = Math.random() * 4.5 + 0.5;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      petalVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: -(Math.random() * 0.006 + 0.003),
        z: (Math.random() - 0.5) * 0.005,
        rotSpeed: Math.random() * 0.02,
      });
    }

    const petalParticleGeo = new THREE.BufferGeometry();
    petalParticleGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

    // Particle texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d');
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
      grad.addColorStop(0, '#f472b6');
      grad.addColorStop(0.5, '#ec4899');
      grad.addColorStop(1, 'rgba(236, 72, 153, 0)');
      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(32, 32, 30, 0, Math.PI * 2);
      pCtx.fill();
    }
    const petalParticleTex = new THREE.CanvasTexture(pCanvas);

    const petalParticleMat = new THREE.PointsMaterial({
      size: 0.28,
      map: petalParticleTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const petalParticles = new THREE.Points(petalParticleGeo, petalParticleMat);
    scene.add(petalParticles);

    // --- RAYCASTER FOR INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const exhibit = exhibitMeshMap.get(hit);
        if (exhibit) {
          soundCtrl.playChime();
          onSelectExhibit(exhibit);
        }
      }
    };

    const onPointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes, false);
      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // Resize handler
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // --- ANIMATION LOOP ---
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();

      // Smooth camera interpolation toward target position
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPosRef.current.x, 3.2, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPosRef.current.y, 3.2, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPosRef.current.z, 3.2, delta);

      controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookAtRef.current.x, 3.5, delta);
      controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookAtRef.current.y, 3.5, delta);
      controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookAtRef.current.z, 3.5, delta);

      controls.update();

      // Animate floating petals
      const positions = petalParticleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < petalCount; i++) {
        positions[i * 3] += petalVelocities[i].x;
        positions[i * 3 + 1] += petalVelocities[i].y;
        positions[i * 3 + 2] += petalVelocities[i].z;

        // Reset if fell below floor
        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 4.8;
          positions[i * 3] = (Math.random() - 0.5) * 14;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
        }
      }
      petalParticleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    }

    tick();

    // Clean up
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [onSelectExhibit]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
    />
  );
};

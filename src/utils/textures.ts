import * as THREE from 'three';

/**
 * Procedural texture generators for Vietnamese cultural elements:
 * - Dong Son Bronze Drum medallion (Trống đồng Đông Sơn)
 * - Polished Wood Parquet floor with plank lines
 * - Red velvet carpet with golden geometric borders
 * - Wall paneling textures with lotus filigree
 */

export function createBronzeDrumTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;

  // Background deep warm bronze
  ctx.fillStyle = '#78350f';
  ctx.fillRect(0, 0, size, size);

  // Radial gradient for metallic sheen
  const radGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, size / 2);
  radGrad.addColorStop(0, '#d97706');
  radGrad.addColorStop(0.4, '#b45309');
  radGrad.addColorStop(0.8, '#78350f');
  radGrad.addColorStop(1, '#451a03');
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 - 8, 0, Math.PI * 2);
  ctx.fill();

  // Concentric rings
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4;
  const ringRadii = [30, 80, 130, 190, 260, 330, 400, 470];
  ringRadii.forEach((r) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Central 14-point Sun (Mặt trời 14 tia)
  ctx.fillStyle = '#fef08a';
  const rays = 14;
  const outerR = 75;
  const innerR = 25;
  ctx.beginPath();
  for (let i = 0; i < rays * 2; i++) {
    const angle = (i * Math.PI) / rays - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Geometric teeth / saw-tooth pattern in ring (r: 130 - 190)
  ctx.fillStyle = '#fef08a';
  const teethCount = 48;
  for (let i = 0; i < teethCount; i++) {
    const angle1 = (i * Math.PI * 2) / teethCount;
    const angle2 = ((i + 0.5) * Math.PI * 2) / teethCount;
    const angle3 = ((i + 1) * Math.PI * 2) / teethCount;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle1) * 140, cy + Math.sin(angle1) * 140);
    ctx.lineTo(cx + Math.cos(angle2) * 180, cy + Math.sin(angle2) * 180);
    ctx.lineTo(cx + Math.cos(angle3) * 140, cy + Math.sin(angle3) * 140);
    ctx.fill();
  }

  // Flying crane birds (Chim Lạc bay ngược chiều kim đồng hồ) in ring (r: 260 - 330)
  const birdCount = 10;
  for (let i = 0; i < birdCount; i++) {
    const angle = (i * Math.PI * 2) / birdCount;
    const bx = cx + Math.cos(angle) * 295;
    const by = cy + Math.sin(angle) * 295;

    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(angle - Math.PI / 2);

    // Stylized flying bird
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(0, -25); // beak
    ctx.lineTo(8, -8);  // neck
    ctx.lineTo(35, 12); // wing right
    ctx.lineTo(8, 5);
    ctx.lineTo(0, 30);  // tail
    ctx.lineTo(-8, 5);
    ctx.lineTo(-35, 12); // wing left
    ctx.lineTo(-8, -8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Outer border with dots
  const dotCount = 90;
  for (let i = 0; i < dotCount; i++) {
    const angle = (i * Math.PI * 2) / dotCount;
    const dx = cx + Math.cos(angle) * 435;
    const dy = cy + Math.sin(angle) * 435;
    ctx.beginPath();
    ctx.arc(dx, dy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createWoodFloorTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Rich warm teak wood
  ctx.fillStyle = '#854d0e';
  ctx.fillRect(0, 0, size, size);

  // Planks
  const plankHeight = 64;
  const plankCount = size / plankHeight;

  for (let i = 0; i < plankCount; i++) {
    const y = i * plankHeight;
    // Shade variation per plank
    const tint = (i % 2 === 0 ? 10 : -10) + ((i % 5) * 4 - 8);
    ctx.fillStyle = `rgb(${133 + tint}, ${77 + tint / 2}, ${14 + tint / 3})`;
    ctx.fillRect(0, y, size, plankHeight - 2);

    // Wood grain lines
    ctx.fillStyle = 'rgba(69, 26, 3, 0.15)';
    for (let g = 0; g < 14; g++) {
      const gy = y + Math.random() * (plankHeight - 4);
      ctx.fillRect(0, gy, size, 1 + Math.random() * 2);
    }

    // Plank joints (staggered)
    const stagger = (i % 3) * 250;
    ctx.fillStyle = 'rgba(30, 10, 2, 0.5)';
    ctx.fillRect(0, y + plankHeight - 2, size, 2); // horizontal groove
    for (let j = 0; j < 4; j++) {
      const jx = (stagger + j * 340) % size;
      ctx.fillRect(jx, y, 2, plankHeight - 2); // vertical groove
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

export function createRedCarpetTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep crimson velvet
  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(0, 0, width, height);

  // Velvet grain texture
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(220, 38, 38, 0.15)' : 'rgba(153, 27, 27, 0.15)';
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Golden side borders
  const borderWidth = 32;
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(10, 0, borderWidth, height);
  ctx.fillRect(width - 10 - borderWidth, 0, borderWidth, height);

  // Greek key / geometric fret pattern on border
  ctx.fillStyle = '#991b1b';
  for (let y = 0; y < height; y += 40) {
    ctx.fillRect(14, y + 6, borderWidth - 8, 4);
    ctx.fillRect(width - 10 - borderWidth + 4, y + 6, borderWidth - 8, 4);
  }

  // Outer gold fringe
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(4, 0, 4, height);
  ctx.fillRect(width - 8, 0, 4, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

export function createLotusWallBanner(): THREE.CanvasTexture {
  const width = 1024;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Warm cream background
  const grad = ctx.createLinearGradient(0, 0, width, 0);
  grad.addColorStop(0, '#fef3c7');
  grad.addColorStop(0.5, '#fffbeb');
  grad.addColorStop(1, '#fef3c7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Red and gold borders
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, width, 14);
  ctx.fillRect(0, height - 14, width, 14);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 14, width, 6);
  ctx.fillRect(0, height - 20, width, 6);

  // Title
  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 52px "Be Vietnam Pro", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH', width / 2, height / 2 - 12);

  ctx.fillStyle = '#d97706';
  ctx.font = '600 24px "Be Vietnam Pro", sans-serif';
  ctx.fillText('Học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh', width / 2, height / 2 + 36);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

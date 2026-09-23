/**
 * Procedural Canvas Generator for MEGHA-DRISHTI.
 * Renders realistic synthetic radar, precipitation anomalies, and
 * 12 km vs 5 km diffusion-downscaled member fields without external image assets.
 */

// Radar colormap: from dark navy/blue (low) -> cyan -> green -> yellow -> orange -> red -> deep magenta/white (extreme)
function getRainColor(val: number): [number, number, number] {
  // val is 0.0 to 1.0
  if (val < 0.1) return [11, 20, 38]; // background
  if (val < 0.25) return [0, 80, 160]; // light rain
  if (val < 0.45) return [0, 180, 200]; // moderate
  if (val < 0.6) return [46, 125, 50];  // green
  if (val < 0.75) return [255, 217, 102]; // yellow
  if (val < 0.88) return [242, 140, 40]; // orange
  if (val < 0.96) return [192, 0, 0];    // red
  return [255, 230, 255]; // extreme purple/white convective core
}

/**
 * Procedural pseudo-random 2D noise / Gaussian kernel
 */
function gaussian(x: number, y: number, cx: number, cy: number, sigmaX: number, sigmaY: number, angle = 0): number {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = x - cx;
  const dy = y - cy;
  const rx = cos * dx - sin * dy;
  const ry = sin * dx + cos * dy;
  return Math.exp(-0.5 * ((rx * rx) / (sigmaX * sigmaX) + (ry * ry) / (sigmaY * sigmaY)));
}

/**
 * Draws a 2D weather field on an HTMLCanvasElement
 */
export function drawWeatherTile(
  canvas: HTMLCanvasElement,
  memberId: number,
  mode: '5km' | '12km' | 'mean',
  width = 120,
  height = 120
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  // Member variations
  const seed = (memberId + 1) * 31.7;
  // Center coordinates vary slightly per member
  const cx = mode === 'mean' ? width * 0.5 : width * 0.5 + Math.sin(seed) * (width * 0.16);
  const cy = mode === 'mean' ? height * 0.5 : height * 0.5 + Math.cos(seed * 1.3) * (height * 0.16);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let intensity = 0;

      if (mode === 'mean') {
        // Ensemble mean: large, smooth, washed-out blob (no sharp peak)
        const g1 = gaussian(x, y, width * 0.5, height * 0.5, width * 0.35, height * 0.35);
        intensity = g1 * 0.52; // Peak is smoothed away!
      } else if (mode === '12km') {
        // 12 km model: coarse grid, rounded blur
        // Pixelate to simulate 12 km grid resolution
        const blockSize = 8;
        const bx = Math.floor(x / blockSize) * blockSize + blockSize / 2;
        const by = Math.floor(y / blockSize) * blockSize + blockSize / 2;

        const g1 = gaussian(bx, by, cx, cy, width * 0.22, height * 0.22);
        const g2 = gaussian(bx, by, cx + 15, cy - 10, width * 0.14, height * 0.14);
        intensity = Math.min(1.0, g1 * 0.82 + g2 * 0.35);
      } else {
        // 5 km CorrDiff downscaled: fine detail, spiral feeder bands, intense pin-point peak
        const gCore = gaussian(x, y, cx, cy, width * 0.08, height * 0.08); // Sharp peak!
        const gArm1 = gaussian(x, y, cx - 18, cy + 12, width * 0.09, height * 0.18, 0.7);
        const gArm2 = gaussian(x, y, cx + 22, cy - 15, width * 0.07, height * 0.22, -0.6);
        const noise = Math.sin(x * 0.2 + seed) * Math.cos(y * 0.2 - seed) * 0.08;
        
        intensity = Math.min(1.0, Math.max(0, gCore * 1.15 + gArm1 * 0.65 + gArm2 * 0.55 + noise));
      }

      const [r, g, b] = getRainColor(intensity);
      const pixelIdx = (y * width + x) * 4;
      data[pixelIdx] = r;
      data[pixelIdx + 1] = g;
      data[pixelIdx + 2] = b;
      data[pixelIdx + 3] = intensity > 0.08 ? 255 : 40; // semi-transparent outer edges
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Subtle border / grid mark
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);
}

/**
 * Draws the interactive split-screen comparison: 12 km (left) vs 5 km (right)
 */
export function drawSplitComparison(
  canvas: HTMLCanvasElement,
  splitRatio: number, // 0.0 to 1.0 (divider position)
  width = 560,
  height = 340
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const splitX = Math.round(width * Math.max(0.01, Math.min(0.99, splitRatio)));
  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const cx = width * 0.48;
  const cy = height * 0.52;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let intensity = 0;
      const isRight = x >= splitX;

      if (!isRight) {
        // Left side: 12 km coarse grid (NEPS-G)
        const blockSize = 14;
        const bx = Math.floor(x / blockSize) * blockSize + blockSize / 2;
        const by = Math.floor(y / blockSize) * blockSize + blockSize / 2;
        const g1 = gaussian(bx, by, cx, cy, width * 0.28, height * 0.28);
        const g2 = gaussian(bx, by, cx + 45, cy - 35, width * 0.2, height * 0.2);
        intensity = Math.min(1.0, g1 * 0.78 + g2 * 0.42);
      } else {
        // Right side: 5 km Diffusion AI (CorrDiff)
        // High fidelity eye, feeder spiral arms, sharp rain cells
        const dist = Math.hypot(x - cx, y - cy);
        const angle = Math.atan2(y - cy, x - cx);
        const spiral = Math.sin(angle * 2.5 - dist * 0.08);

        const gEye = gaussian(x, y, cx, cy, 14, 14); // eye
        const gCore = gaussian(x, y, cx, cy, 65, 65);
        const rainBands = spiral > 0.2 ? 0.35 * spiral : 0;
        const fineNoise = (Math.sin(x * 0.4) * Math.cos(y * 0.4)) * 0.06;

        intensity = Math.min(1.0, Math.max(0, (gCore * 0.95 - gEye * 0.4) + rainBands + fineNoise));
      }

      const [r, g, b] = getRainColor(intensity);
      const pixelIdx = (y * width + x) * 4;
      data[pixelIdx] = r;
      data[pixelIdx + 1] = g;
      data[pixelIdx + 2] = b;
      data[pixelIdx + 3] = intensity > 0.05 ? 255 : 50;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Draw divider line
  ctx.strokeStyle = '#F28C28';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(splitX, 0);
  ctx.lineTo(splitX, height);
  ctx.stroke();

  // Draw glowing handle
  ctx.fillStyle = '#F28C28';
  ctx.shadowColor = '#F28C28';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(splitX, height / 2, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#060B18';
  ctx.beginPath();
  ctx.arc(splitX, height / 2, 10, 0, Math.PI * 2);
  ctx.fill();
}

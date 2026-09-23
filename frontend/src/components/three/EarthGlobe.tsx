import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface EarthGlobeProps {
  onLoaded?: () => void;
  className?: string;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({ onLoaded, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Accessibility & device capability detection
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 4.35);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Earth Group (holds tilted globe, clouds, cyclone vortex, trajectory)
    const earthGroup = new THREE.Group();
    earthGroup.rotation.x = 0.32; // Realistic ~18° axial tilt
    earthGroup.rotation.y = -1.15; // Initial rotational orientation
    scene.add(earthGroup);

    // Helper: Geographic coordinate to 2D Texture UV mapping
    const toXY = (lon: number, lat: number, width: number, height: number): [number, number] => {
      const x = ((lon + 180) / 360) * width;
      const y = ((90 - lat) / 180) * height;
      return [x, y];
    };

    // 3. High-Fidelity Day Texture (Oceans, Coastlines, Thar, Himalayas)
    const createDayTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Deep Ocean background with shelf gradients
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      oceanGrad.addColorStop(0, '#020b1c');
      oceanGrad.addColorStop(0.3, '#041432');
      oceanGrad.addColorStop(0.5, '#061c42');
      oceanGrad.addColorStop(0.7, '#041432');
      oceanGrad.addColorStop(1, '#020b1c');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Continent drawing helper
      const drawPolygon = (coords: number[][], fill: string, stroke?: string, strokeW = 2) => {
        ctx.beginPath();
        coords.forEach(([lon, lat], i) => {
          const [x, y] = toXY(lon, lat, canvas.width, canvas.height);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = strokeW;
          ctx.stroke();
        }
      };

      // Indian Subcontinent High-Precision Outline
      const indiaCoords = [
        [68.5, 23.5], [69.5, 22.0], [72.2, 21.0], [72.8, 19.2], [73.5, 16.5],
        [74.5, 14.0], [75.5, 11.5], [77.5, 8.1], // Kanyakumari apex
        [79.8, 10.2], [80.3, 13.1], [82.5, 16.8], [85.5, 19.8], [87.5, 21.6],
        [88.8, 22.2], [90.5, 22.5], [91.8, 21.5], // Sundarbans & Bangladesh coast
        [93.5, 25.0], [96.5, 28.0], [94.5, 29.5], [89.0, 27.5], // NE India & Bhutan border
        [84.5, 28.2], [80.5, 30.5], [76.5, 33.5], [74.0, 36.5], // Himalayas & Ladakh
        [72.5, 34.0], [71.0, 30.0], [68.0, 28.0], [68.5, 24.5] // Thar border & Rann of Kutch
      ];
      drawPolygon(indiaCoords, '#1b3b28', '#2b5c3e', 3);

      // Thar Desert (Golden amber arid shading)
      const tharCoords = [
        [70.0, 28.0], [73.5, 28.5], [74.5, 26.0], [71.5, 24.5], [69.5, 26.0]
      ];
      drawPolygon(tharCoords, '#524322', '#6b582d', 1);

      // Himalayan snow peaks (White cap ridge)
      const himalayasCoords = [
        [74.0, 35.5], [78.5, 32.5], [84.0, 29.5], [90.0, 28.5],
        [89.5, 29.5], [83.0, 31.0], [77.5, 34.0]
      ];
      drawPolygon(himalayasCoords, '#dce7eb', '#ffffff', 1.5);

      // Sri Lanka
      const [slx, sly] = toXY(80.7, 7.8, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.ellipse(slx, sly, 14, 22, 0.1, 0, Math.PI * 2);
      ctx.fillStyle = '#1c3d28';
      ctx.fill();

      // Eurasia broad landmass
      const eurasia = [
        [-10, 36], [10, 44], [30, 48], [60, 56], [100, 62], [140, 52], [130, 35],
        [105, 20], [100, 10], [98, 5], [94, 15], [88, 22], [70, 28], [55, 26],
        [48, 30], [38, 32], [28, 34], [15, 38], [0, 38]
      ];
      drawPolygon(eurasia, '#142c1c');

      // Africa
      const africa = [
        [-17, 14], [10, 37], [32, 31], [43, 12], [51, 10], [40, -10],
        [30, -32], [18, -34], [12, -5], [5, 5], [-15, 10]
      ];
      drawPolygon(africa, '#1a3320');

      // Arabian Peninsula (Arid desert)
      const arabia = [
        [35, 28], [50, 30], [60, 24], [58, 20], [52, 15], [44, 13], [38, 22]
      ];
      drawPolygon(arabia, '#4a3f28');

      // Australia
      const [aux, auy] = toXY(134, -25, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.ellipse(aux, auy, 95, 68, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#223824';
      ctx.fill();

      // Andaman and Nicobar Islands
      const andaman = [[92.8, 12.0], [92.9, 11.5], [93.0, 9.0], [93.8, 7.0]];
      andaman.forEach(([lon, lat]) => {
        const [ax, ay] = toXY(lon, lat, canvas.width, canvas.height);
        ctx.fillStyle = '#2b5c3e';
        ctx.fillRect(ax, ay, 4, 7);
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    // 4. Night Texture: Vibrant Golden City Lights on Dark Hemisphere
    const createNightTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Pitch black background for deep ocean night
      ctx.fillStyle = '#01040a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Major global & Indian metropolitan lights
      const majorClusters = [
        // India Megacities (Very high intensity golden clusters)
        { lon: 77.2, lat: 28.6, r: 18, intensity: 1.0 }, // Delhi-NCR
        { lon: 72.8, lat: 19.0, r: 16, intensity: 1.0 }, // Mumbai
        { lon: 88.3, lat: 22.5, r: 15, intensity: 0.95 }, // Kolkata
        { lon: 77.5, lat: 12.9, r: 14, intensity: 0.95 }, // Bengaluru
        { lon: 80.2, lat: 13.0, r: 13, intensity: 0.9 }, // Chennai
        { lon: 78.4, lat: 17.3, r: 13, intensity: 0.9 }, // Hyderabad
        { lon: 72.5, lat: 23.0, r: 11, intensity: 0.85 }, // Ahmedabad
        { lon: 73.8, lat: 18.5, r: 10, intensity: 0.8 }, // Pune
        { lon: 75.8, lat: 26.9, r: 10, intensity: 0.8 }, // Jaipur
        { lon: 80.9, lat: 26.8, r: 11, intensity: 0.85 }, // Lucknow-Kanpur
        { lon: 85.8, lat: 20.2, r: 9, intensity: 0.85 }, // Bhubaneswar-Cuttack
        { lon: 76.2, lat: 9.9,  r: 8, intensity: 0.8 }, // Kochi
        { lon: 83.3, lat: 17.7, r: 8, intensity: 0.75 }, // Visakhapatnam
        { lon: 74.8, lat: 31.6, r: 9, intensity: 0.8 }, // Amritsar-Ludhiana
        { lon: 85.1, lat: 25.6, r: 9, intensity: 0.8 }, // Patna

        // Regional capitals & corridors
        { lon: 67.0, lat: 24.8, r: 14, intensity: 0.9 }, // Karachi
        { lon: 74.3, lat: 31.5, r: 12, intensity: 0.85 }, // Lahore
        { lon: 90.4, lat: 23.8, r: 14, intensity: 0.9 }, // Dhaka
        { lon: 79.8, lat: 6.9,  r: 7, intensity: 0.75 }, // Colombo
        { lon: 55.3, lat: 25.2, r: 16, intensity: 1.0 }, // Dubai
        { lon: 54.4, lat: 24.4, r: 12, intensity: 0.9 }, // Abu Dhabi
        { lon: 51.5, lat: 25.3, r: 11, intensity: 0.85 }, // Doha
        { lon: 46.7, lat: 24.7, r: 13, intensity: 0.85 }, // Riyadh
        { lon: 100.5, lat: 13.7, r: 15, intensity: 0.95 }, // Bangkok
        { lon: 103.8, lat: 1.3,  r: 14, intensity: 1.0 }, // Singapore
        { lon: 31.2,  lat: 30.0, r: 16, intensity: 0.95 }, // Cairo
        { lon: 2.3,   lat: 48.8, r: 18, intensity: 1.0 }, // Paris
        { lon: -0.1,  lat: 51.5, r: 18, intensity: 1.0 }, // London
      ];

      // Draw glowing light clusters
      majorClusters.forEach((c) => {
        const [x, y] = toXY(c.lon, c.lat, canvas.width, canvas.height);

        // Outer warm ambient glow
        const outerGrad = ctx.createRadialGradient(x, y, 1, x, y, c.r * 1.8);
        outerGrad.addColorStop(0, `rgba(242, 140, 40, ${0.7 * c.intensity})`);
        outerGrad.addColorStop(0.5, `rgba(255, 190, 60, ${0.3 * c.intensity})`);
        outerGrad.addColorStop(1, 'rgba(242, 140, 40, 0)');
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.arc(x, y, c.r * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Intense core dot
        const coreGrad = ctx.createRadialGradient(x, y, 0, x, y, c.r * 0.6);
        coreGrad.addColorStop(0, `rgba(255, 255, 230, ${0.98 * c.intensity})`);
        coreGrad.addColorStop(0.6, `rgba(255, 220, 120, ${0.8 * c.intensity})`);
        coreGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(x, y, c.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Inter-city transport light corridors (Indo-Gangetic belt & golden quadrilateral)
      const corridors = [
        [[77.2, 28.6], [80.9, 26.8], [85.1, 25.6], [88.3, 22.5]], // Delhi to Kolkata via Kanpur & Patna
        [[77.2, 28.6], [75.8, 26.9], [72.5, 23.0], [72.8, 19.0]], // Delhi to Mumbai via Jaipur & Ahmedabad
        [[72.8, 19.0], [73.8, 18.5], [77.5, 12.9], [80.2, 13.0]], // Mumbai to Chennai via Pune & Bengaluru
      ];

      corridors.forEach((pts) => {
        ctx.beginPath();
        pts.forEach(([lon, lat], i) => {
          const [x, y] = toXY(lon, lat, canvas.width, canvas.height);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = 'rgba(242, 160, 60, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    // 5. Procedural Cloud Layer Texture
    const createCloudTexture = (): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Swirling atmospheric fronts
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      for (let i = 0; i < 65; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const rw = 50 + Math.random() * 140;
        const rh = 12 + Math.random() * 32;
        const rot = Math.random() * 0.5 - 0.25;
        ctx.beginPath();
        ctx.ellipse(x, y, rw, rh, rot, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dense tropical cloud band along ITCZ equator
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      for (let i = 0; i < 20; i++) {
        const x = (i / 20) * canvas.width + Math.random() * 30;
        const y = (0.5 + (Math.random() - 0.5) * 0.08) * canvas.height;
        ctx.beginPath();
        ctx.ellipse(x, y, 70, 18, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      return texture;
    };

    const earthRadius = 1.45;
    const dayTexture = createDayTexture();
    const nightTexture = createNightTexture();
    const cloudTexture = createCloudTexture();

    // 6. Day-Night Terminator Blended Earth Shader
    // Sun position: directional lighting shining from upper right (east)
    const sunVector = new THREE.Vector3(1.2, 0.5, 0.9).normalize();

    const earthShader = {
      uniforms: {
        tDay: { value: dayTexture },
        tNight: { value: nightTexture },
        uSunDirection: { value: sunVector },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D tDay;
        uniform sampler2D tNight;
        uniform vec3 uSunDirection;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          vec3 sunDir = normalize(uSunDirection);

          float NdotL = dot(normal, sunDir);
          
          // Smooth day/night terminator transition
          float dayFactor = smoothstep(-0.12, 0.18, NdotL);
          float nightFactor = 1.0 - dayFactor;

          vec4 dayColor = texture2D(tDay, vUv);
          vec4 nightColor = texture2D(tNight, vUv);

          // Daylight with diffuse falloff + ambient base
          vec3 dayLit = dayColor.rgb * (max(0.0, NdotL) * 0.95 + 0.18);

          // Specular glint on oceanic surfaces (blue > green)
          float isWater = max(0.0, dayColor.b - dayColor.g * 1.15);
          if (NdotL > 0.0 && isWater > 0.05) {
            vec3 halfVec = normalize(sunDir + viewDir);
            float spec = pow(max(0.0, dot(normal, halfVec)), 32.0) * isWater;
            dayLit += vec3(0.95, 0.98, 1.0) * spec * 0.75;
          }

          // Golden night lights on dark side
          vec3 nightLit = nightColor.rgb * nightFactor * 2.2;

          // Atmospheric Fresnel limb brightening on globe edge
          float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.8);
          vec3 atmosphereLimb = mix(vec3(0.02, 0.25, 0.65), vec3(0.15, 0.65, 1.0), dayFactor);

          vec3 finalColor = dayLit + nightLit + atmosphereLimb * fresnel * 0.7;

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    };

    const earthGeo = new THREE.SphereGeometry(earthRadius, 64, 64);
    const earthMat = new THREE.ShaderMaterial({
      uniforms: earthShader.uniforms,
      vertexShader: earthShader.vertexShader,
      fragmentShader: earthShader.fragmentShader,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 7. Separate Slowly-Rotating Cloud Layer
    const cloudsGeo = new THREE.SphereGeometry(earthRadius + 0.022, 64, 64);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.62,
      blending: THREE.AdditiveBlending,
      roughness: 1.0,
      metalness: 0.0,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    earthGroup.add(cloudsMesh);

    // 8. Proper Atmospheric Outer Rim Glow Shader (Rayleigh Scattering)
    const rimShader = {
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          
          // Edge Fresnel rim intensity
          float rim = 1.0 - max(0.0, dot(normal, viewDir));
          float intensity = pow(rim, 3.4) * 1.8;

          // Pure Rayleigh atmospheric blue to cyan gradient
          vec3 glowColor = mix(vec3(0.0, 0.44, 0.95), vec3(0.3, 0.8, 1.0), rim * 0.8);

          gl_FragColor = vec4(glowColor, intensity);
        }
      `,
    };

    const rimGeo = new THREE.SphereGeometry(earthRadius + 0.11, 48, 48);
    const rimMat = new THREE.ShaderMaterial({
      vertexShader: rimShader.vertexShader,
      fragmentShader: rimShader.fragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    scene.add(rimMesh);

    // Helper: convert lon/lat to 3D Cartesian coordinates on sphere
    const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 9. Bay of Bengal 3D Cyclone: Clear Eye + Dense Eyewall + Spiral Arms
    // Center located over Bay of Bengal (~16.5°N, 87.2°E)
    const cycloneCenterLat = 16.5;
    const cycloneCenterLon = 87.2;

    const particleCount = isMobile ? 650 : 1250;
    const cycloneGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const particleOffsets: {
      radius: number;
      angle: number;
      speed: number;
      altitude: number;
      isEyewall: boolean;
    }[] = [];

    // Eye radius threshold: inside r < 0.022 is the clear, calm eye
    const eyeRadius = 0.022;

    for (let i = 0; i < particleCount; i++) {
      // 55% of particles allocated to dense eyewall right on the rim of the eye
      const isEyewall = i < particleCount * 0.55;
      let r: number;
      let theta: number;
      let speed: number;

      if (isEyewall) {
        // Tightly packed into the eyewall ring [eyeRadius, eyeRadius + 0.026]
        r = eyeRadius + Math.pow(Math.random(), 1.8) * 0.026;
        theta = Math.random() * Math.PI * 2;
        // Maximum rotational velocity at the eyewall (vortex peak!)
        speed = 0.045 + (Math.random() * 0.015);
      } else {
        // Outer feeder spiral arms [eyeRadius + 0.026, 0.17]
        const arm = i % 3; // 3 logarithmic spiral arms
        const armOffset = (arm * Math.PI * 2) / 3;
        const progress = Math.pow(Math.random(), 1.3);
        r = eyeRadius + 0.026 + progress * 0.12;
        // Logarithmic spiral angle
        theta = armOffset + progress * Math.PI * 3.2 + (Math.random() - 0.5) * 0.35;
        // Speed decays with radius
        speed = 0.015 + (0.025 / (r + 0.05));
      }

      particleOffsets.push({
        radius: r,
        angle: theta,
        speed: speed,
        altitude: earthRadius + 0.032 + Math.random() * 0.014,
        isEyewall: isEyewall,
      });

      // Colors:
      // Eyewall: blinding brilliant white and electric cyan
      // Spiral arms: cyan fading to orange innovation highlights on feeder arm
      if (isEyewall) {
        colors[i * 3] = 0.98;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      } else if (i % 3 === 0) {
        // Innovation accent arm (orange)
        colors[i * 3] = 0.95;
        colors[i * 3 + 1] = 0.55;
        colors[i * 3 + 2] = 0.16;
      } else {
        // Convective cyan rainband
        colors[i * 3] = 0.22;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1.0;
      }
    }

    cycloneGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    cycloneGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const cycloneMat = new THREE.PointsMaterial({
      size: isMobile ? 0.022 : 0.028,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const cycloneParticles = new THREE.Points(cycloneGeo, cycloneMat);
    earthGroup.add(cycloneParticles);

    // Eye ring border marker on the sphere
    const eyeCenterVec = latLonToVector3(cycloneCenterLat, cycloneCenterLon, earthRadius + 0.024);
    const eyeMarkerGeo = new THREE.RingGeometry(0.019, 0.024, 32);
    const eyeMarkerMat = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const eyeMarkerMesh = new THREE.Mesh(eyeMarkerGeo, eyeMarkerMat);
    eyeMarkerMesh.position.copy(eyeCenterVec);
    eyeMarkerMesh.lookAt(new THREE.Vector3(0, 0, 0));
    earthGroup.add(eyeMarkerMesh);

    // 10. Dashed Trajectory Track toward Odisha Coast
    const trackLatLons = [
      [11.0, 86.4],
      [13.5, 86.6],
      [16.5, 87.2],
      [19.2, 87.8],
      [20.8, 88.0], // Landfall near Odisha / WB coast
    ];

    const trackPoints = trackLatLons.map(([lat, lon]) =>
      latLonToVector3(lat, lon, earthRadius + 0.025)
    );
    const trackCurve = new THREE.CatmullRomCurve3(trackPoints);
    const trackGeo = new THREE.BufferGeometry().setFromPoints(trackCurve.getPoints(50));
    const trackMat = new THREE.LineDashedMaterial({
      color: 0xF28C28,
      dashSize: 0.035,
      gapSize: 0.02,
      linewidth: 2,
    });
    const trackLine = new THREE.Line(trackGeo, trackMat);
    trackLine.computeLineDistances();
    earthGroup.add(trackLine);

    // 11. Pulsing Landfall Target Marker (Odisha Coast)
    const targetPos = latLonToVector3(20.8, 88.0, earthRadius + 0.026);
    const targetGeo = new THREE.RingGeometry(0.014, 0.034, 32);
    const targetMat = new THREE.MeshBasicMaterial({
      color: 0xC00000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const targetMesh = new THREE.Mesh(targetGeo, targetMat);
    targetMesh.position.copy(targetPos);
    targetMesh.lookAt(new THREE.Vector3(0, 0, 0));
    earthGroup.add(targetMesh);

    // 12. Starfield Background
    const starCount = isMobile ? 650 : 1500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 45;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      starPositions[i * 3 + 2] = -12 + (Math.random() - 0.5) * 35;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xddeeff,
      size: 0.038,
      transparent: true,
      opacity: 0.75,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 13. Lighting
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.copy(sunVector).multiplyScalar(10);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x061124, 1.1);
    scene.add(ambientLight);

    // 14. Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.35;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Target rotation to face the Indian Subcontinent
    const targetRotY = -1.58;
    const targetRotX = 0.36;

    let time = 0;
    let animationFrameId: number;

    // Pre-allocated vectors for 60 FPS animation loop (zero garbage collection!)
    const centerVec = latLonToVector3(cycloneCenterLat, cycloneCenterLon, earthRadius);
    const normal = centerVec.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const tangentX = new THREE.Vector3().crossVectors(up, normal).normalize();
    const tangentY = new THREE.Vector3().crossVectors(normal, tangentX).normalize();
    const worldPos = new THREE.Vector3();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.016;

      if (!prefersReducedMotion) {
        // Ease Earth rotation towards India
        earthGroup.rotation.y += (targetRotY - earthGroup.rotation.y) * 0.015;
        earthGroup.rotation.x += (targetRotX - earthGroup.rotation.x) * 0.015;

        // Apply smooth mouse parallax
        scene.position.x += (mouseX - scene.position.x) * 0.05;
        scene.position.y += (-mouseY - scene.position.y) * 0.05;

        // Separate slowly-rotating cloud layer
        cloudsMesh.rotation.y += 0.0011;

        // Pulse the landfall ring
        const targetScale = 1.0 + Math.sin(time * 4) * 0.25;
        targetMesh.scale.set(targetScale, targetScale, 1);

        // Pulse the eye ring
        const eyeScale = 1.0 + Math.sin(time * 3) * 0.08;
        eyeMarkerMesh.scale.set(eyeScale, eyeScale, 1);

        // Cyclone particles animation (counter-clockwise spiral with calm center)
        const posAttr = cycloneGeo.attributes.position as THREE.BufferAttribute;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const p = particleOffsets[i];
          p.angle += p.speed * 0.42; // Rotate counter-clockwise

          const localX = p.radius * Math.cos(p.angle);
          const localY = p.radius * Math.sin(p.angle);

          worldPos.copy(centerVec)
            .addScaledVector(tangentX, localX)
            .addScaledVector(tangentY, localY)
            .normalize()
            .multiplyScalar(p.altitude);

          array[i * 3] = worldPos.x;
          array[i * 3 + 1] = worldPos.y;
          array[i * 3 + 2] = worldPos.z;
        }
        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoading(false);
    if (onLoaded) onLoaded();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onLoaded]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060B18] z-10">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-3" />
          <p className="text-xs font-mono text-slate-400 tracking-wider">
            INITIALIZING 3D SPHERICAL MODEL...
          </p>
        </div>
      )}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};

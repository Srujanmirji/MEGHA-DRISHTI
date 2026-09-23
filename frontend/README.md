# MEGHA-DRISHTI (मेघ-दृष्टि) — Web Prototype

**Smart India Hackathon 2026 · Problem Statement 26078 · Team CodeX_2026**  
**AI Extreme Weather Forecasting System for NCMRWF & IMD Forecasters**

An interactive, production-quality mission-control workstation and scientific explainer for **MEGHA-DRISHTI**: an AI system that tracks extreme weather hazards (cyclones, heat domes, cold waves, extreme rain) in India's 10-day ensemble forecast (NEPS-G) and sharpens them to ~5 km resolution without averaging away critical localized peaks.

---

## 🚀 Key Features

### 1. Realistic 3D Earth & Convective Cyclone
- **Atmospheric Rim Glow**: Custom Rayleigh scattering shader (`ShaderMaterial` on BackSide sphere) calculating view-angle Fresnel falloff ($(1 - \mathbf{n} \cdot \mathbf{v})^{3.4}$), rendering an authentic limb glow transitioning from deep sapphire blue `#0044F2` to vibrant cyan `#38BDF8`.
- **Day/Night Terminator & Night City Lights**: Surface shader computing solar angle $\mathbf{n} \cdot \mathbf{l}_{\text{sun}}$ with a smooth terminator transition. Golden-amber city lights (Delhi-NCR, Mumbai, Kolkata, Bengaluru, Chennai, Hyderabad, Bangkok, Dubai) glow exclusively on the night hemisphere.
- **Convective Cloud Layer**: Independent spherical mesh ($R = 1.472$) with procedural swirling fronts and ITCZ tropical convergence bands rotating at independent angular velocity.
- **Physics-Informed Vortex**: Clear calm eye ($r_{\text{eye}} \approx 25\,\text{km}$) with dense, high-angular-velocity eyewall ($55\%$ particle density) and 3 spiral feeder bands maintaining 60 FPS.

### 2. Forecaster Mission Control Console (`/console`)
- **MapLibre GL Workstation**: High-performance WebGL map with CARTO Dark Matter styling, pan-India quick reset, and offline fallback.
- **5 Toggleable Map Layers**:
  1. *Alert Footprint*: Dynamic risk boundary calibrated to Fractions Skill Score (FSS).
  2. *Consensus Track*: Steering track interpolated across 23 ensemble members.
  3. *23 Member Spaghetti*: Individual realization tracks revealing track dispersion and bifurcations.
  4. *EFI Anomaly Heatmap*: Continuous climatological anomaly field.
  5. *Probability Envelope*: 90th percentile hazard corridor.
- **Continuous Lead-Time Playback & Vertex Morphing**:
  - `requestAnimationFrame` playback (0h–240h) at $1\times$ and $2\times$ speeds.
  - Every vertex $\mathbf{v}_i$ of the alert polygon is interpolated continuously between 12h keyframes ($\mathbf{v}_i(t) = (1-\alpha)\mathbf{v}_{0,i} + \alpha \mathbf{v}_{1,i}$) so the alert footprint shrinks and shifts naturally without snapping.
  - Dual-frequency pulsing shockwave marker anchored to dynamic coordinates.
  - Keyboard shortcuts: `←` / `→` step 12 hours, `Space` toggles Play/Pause.

### 3. Ranked Threat Board Cards
- **Hover Elevation**: Smooth card lift (`hover:-translate-y-1 hover:shadow-xl`).
- **Illuminated Severity Edge**: Color-coded left edge strip (Red for Extreme Warning, Orange for Warning, Amber for Watch, Blue for Advisory).
- **Embedded 10-Day EFI Sparklines**: Compact inline SVG sparkline showing full 10-day anomaly trend with peak indicator dot.

### 4. 5-Tab Intelligence Dossier
1. **Evidence**: Extreme Forecast Index (EFI), Shift of Tails (SOT), member consensus (21/23), exceedance probability, and 10-day Recharts EFI area chart.
2. **23 Members**: 5×5 grid of member thumbnails with "12 km vs 5 km" and "Show Mean" toggles. Clicking any thumbnail opens an interactive split-slider before/after inspection modal.
3. **Footprint**: FSS sizing basis explanation, spatial skill vs lead-time curve, and impacted administrative districts (Puri, Jagatsinghpur, Kendrapara, etc.).
4. **Verification**: Kinetic energy power spectrum ($k^{-5/3}$), Tail Q-Q plot vs IPED observations, and reliability diagram labelled *"Illustrative until pilot results"*.
5. **API**: Formatted GeoJSON guidance payload with one-click copy and JSON file download (WMO WIS 2.0 compliant).

### 5. Full Bilingual Support (`EN / हिन्दी`)
- Instant zero-reload toggle in top navigation.
- High-fidelity Devanagari typography (`Noto Sans Devanagari`) across all threat cards, telemetry HUDs, lead-time controls, dossiers, and scientific notes.

### 6. Interactive Methodology Sandbox (`/method`)
- Live dual-CDF shifting simulator demonstrating how ensemble shifts relative to the 20-year IMDAA M-climate yield EFI and Shift of Tails (SOT).
- Authoritative documentation for NEPS-G, NEPS-R, IMDAA, and IPED datasets with direct DOI citations.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Devanagari Typography
- **3D Graphics**: Three.js via `@react-three/fiber` & `@react-three/drei`
- **Mapping**: MapLibre GL (`maplibre-gl`)
- **Data Visualization**: Recharts + Custom HTML5 Canvas procedural generators
- **Icons & Animation**: Lucide React + CSS keyframe animations

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or later)
- `pnpm` (recommended) or `npm`

### Installation & Run

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
pnpm install

# Start local development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## ⚠️ Scientific & Operational Disclaimers

- **DEMO DATA — illustrative**: Meteorological fields and cyclone trajectories are realistic simulations based on historical events (e.g. Cyclone Amphan replay) for demonstration purposes.
- **Guidance for IMD forecasters — not a public warning**: This prototype generates high-resolution operational guidance for meteorologists to aid evacuation planning, not automated public alerts.


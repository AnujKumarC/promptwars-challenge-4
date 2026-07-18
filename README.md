# FIFA Nexus AI: AI-Powered Smart Stadium & Tournament Operations Platform

**FIFA Nexus AI** is an advanced, production-ready Command Center and Fan Experience platform designed for the **FIFA World Cup 2026**. Fusing real-time stadium metrics simulation, custom interactive pathfinding SVG maps, and Google's Gemini-powered conversation models, it addresses the chaotic bottlenecks of matchday events.

---

## Key Platform Features

1. **Intelligent Command Dashboard (Admin)**
   - Unified overview of live attendance, crowd density, parking capacity, and resource utility metrics (energy, water, waste).
   - Generates real-time AI dispatch recommendations for crowd rerouting, volunteer assignments, and transit schedules.

2. **Interactive Spatial Map & Pathfinding (Fan & Staff)**
   - Predefined, fully custom SVG rendering of the FIFA Nexus Arena.
   - Highlights 4 routing modes: **Shortest path**, **Accessible (Wheelchair) path** (excluding stairs/stands), **Low Crowd paths** (routing away from congestion hotspots), and **Code Red Evacuation paths**.

3. **Gemini AI Chat Assistant**
   - Natural language stadium advisor supporting speech synthesis voice output and voice microphone dictation.
   - Smart offline search fallback providing immediate guidance on food courts, transport schedules, medical hubs, and toilet stations.

4. **Incident & Emergency Dispatch System (Security & Medical)**
   - Toggles code-red emergencies (Fire, Stampede, Suspicious Object) which propagate alerts globally, force maps into evacuation modes, and direct fans to safety.
   - Medical triage intake queue prioritizing incidents based on patient symptoms.
   - Face recognition surveillance simulation logs with boundary breach alarms.

5. **A11y Accessibility Suite**
   - High-contrast visual overlays, font size scaling engines, and Web Speech API integrations.

---

## Modern Visual Design Tokens

FIFA Nexus AI is crafted to emulate the sleekest visual design standards of Arc Browser, Stripe, and Apple:
- **Glassmorphism**: Dense backdrops (`backdrop-blur-md`) with inner glowing borders.
- **Dark Mode by default**: Deep slate backgrounds with vibrant gradient accents.
- **Premium Micro-interactions**: Smooth card lifts, tap scaling, and path drawer loops powered by **Framer Motion**.
- **Interactive Analytics**: Custom, lightweight animated SVG charts (Line, Bar, and Donut charts) without heavy bundle-hydration lag.

---

## File Structure

```
├── public/                  # Core static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts  # Gemini API Route with high-fidelity fallback simulator
│   │   ├── auth/
│   │   │   └── page.tsx      # Multi-step SSO/Email login and role selection screen
│   │   ├── dashboard/
│   │   │   └── page.tsx      # Command center container with sidebar navigation
│   │   ├── globals.css       # Custom animations, variables, and contrast styles
│   │   └── layout.tsx        # Root setup with providers and viewport layouts
│   ├── components/
│   │   ├── analytics/
│   │   │   └── PremiumCharts.tsx # Custom animated SVG Line, Bar, and Donut charts
│   │   ├── chat/
│   │   │   └── FloatingAssistant.tsx # Speech-enabled Gemini chat overlay bubble
│   │   ├── dashboard/
│   │   │   ├── AdminView.tsx     # Admin commander dashboard
│   │   │   ├── FanView.tsx       # Fan portal with food tab orders & transit lists
│   │   │   ├── VolunteerView.tsx  # Shift check-ins and volunteer scoreboards
│   │   │   ├── SecurityView.tsx  # Incident reporting grids and camera scanners
│   │   │   └── MedicalView.tsx   # Triage queues and paramedic tracking
│   │   ├── map/
│   │   │   └── InteractiveMap.tsx # SVG pathfinder and crowd density heatmap
│   │   └── ui/
│   │       ├── Button.tsx    # Tap-scaling Framer Motion buttons
│   │       ├── Card.tsx      # Glowing border glassmorphic cards
│   │       └── LayoutWrapper.tsx # Global theme and accessibility wrapper
│   └── context/
│       └── AppStateContext.tsx # Central database/simulator and state dispatcher
```

---

## Running Locally

### 1. Clone the project and install dependencies:
```bash
npm install
```

### 2. Configure environment keys:
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key
```
*(If left empty, the application will automatically activate the local keyword simulator fallback, enabling full functionality right away.)*

### 3. Start development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Vercel production:
```bash
npm run build
```

---

## 🏆 Challenge Expectations & Design Architecture

### 1. Chosen Vertical: Smart Stadiums & Tournament Operations
FIFA Nexus AI is explicitly engineered for **Challenge Vertical 4 (Smart Stadiums & Tournament Operations)**. The platform simulates and structures live coordination layers across all event participants—fans, field volunteers, security officers, concourse paramedics, and match organizers—during high-pressure events like the FIFA World Cup 2026.

### 2. Approach & Logic
* **Contextual State Engine**: Uses React Context (`AppStateContext`) to bind metrics (gate congestion, attendance rates, parking limits) with real-time incident triggers. When an emergency is activated, the engine immediately propagates evacuation warnings across all dashboard viewports.
* **Spatial Pathfinder Matrix**: Routes are generated dynamically by parsing selected start terminals and stands block destinations. The map filters nodes based on accessibility rules (wheelchair mode skips stairs) and crowd density indexes (low-crowd mode reroutes around congested zones).
* **Gemini Dialogue Classification**: Integrates the Gemini API to analyze messages and return instructions. If no API key is set, the endpoint falls back to a regex-based keyword parser that extracts intent (e.g. food requests, toilet locations, gate loads) and returns helpful, localized mock statements.

### 3. How the Solution Works
* **Role-Based Viewports**: Users select their role (Fan, Volunteer, Security, Medical, Admin) to open a customized operations dashboard.
* **Interactive SVG Overlay**: The stadium SVG uses glowing path polylines and Framer Motion circles to animate crowd particle movements.
* **Accessibility suite**: Integrates browser Speech Recognition (dictation) and Speech Synthesis (reading) along with high-contrast stylesheets.
* **Testing Suite**: Includes full Jest tests verifying component layouts and React context state initializations.

### 4. Assumptions Made
* **Sensor Availability**: Stadium gates and parking lots are equipped with IoT sensors that stream capacity loads via standard telemetry events.
* **Network Independence**: The spatial pathfinder algorithm runs entirely client-side, allowing evacuation routing to work offline during emergencies.
* **Browser Compatibility**: Users use modern HTML5 browsers with native Web Speech API support for dictation and text-to-speech.


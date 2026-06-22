# Argus — Frontend Specification

All design decisions are locked. Do not deviate from any value in this file without explicit instruction.

---

## Design Gates (Confirmed)

| Gate | Decision |
|---|---|
| 1. Aesthetic | Dark editorial |
| 2. Navigation | Landing: minimal two-item top bar, no hamburger on mobile (two items fit). App interior: minimal top bar with tabs on desktop, bottom tab bar on mobile |
| 3. Background | Landing: premium static hero image (split layout). App interior: static atmospheric |
| 4. Typography | Spectral + IBM Plex Sans + IBM Plex Mono |
| 5. Colour palette | Signal Indigo |
| 6. Landing sections | Six sections in order (Hero, Proof strip, How it works, Features, Why 0G, CTA footer) |
| 7. App pages | Four pages (Dashboard, Research, Vault, Journal) reached via top bar tabs |

---

## Colour System

Define all values as CSS custom properties in `:root` inside `globals.css`. Never hardcode hex values in components.

```css
:root {
  --bg-primary:     #08090f;
  --bg-secondary:   #0d0e18;
  --bg-surface:     #12141f;
  --bg-elevated:    #181a28;
  --accent:         #c8d0e8;
  --accent-hover:   #e2e8f8;
  --accent-glow:    rgba(200, 208, 232, 0.08);
  --accent-dim:     #6168a8;
  --text-primary:   #e4e8f2;
  --text-secondary: #7880a0;
  --text-muted:     #3c4260;
  --border-subtle:  rgba(255, 255, 255, 0.04);
  --border-default: rgba(255, 255, 255, 0.08);
}
```

---

## Typography

Load in `index.html` before any other styles:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

Apply in `globals.css`:

```css
.font-display { font-family: 'Spectral', Georgia, serif; }
.font-body    { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
.font-mono    { font-family: 'IBM Plex Mono', 'Courier New', monospace; }
```

Configure in `tailwind.config.ts`:

```typescript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Spectral', 'Georgia', 'serif'],
        body:    ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono:    ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

**Type scale:**

| Use | Class | Size |
|---|---|---|
| Landing headline | `font-display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.03em]` | 45–88px |
| App page title | `font-display text-3xl leading-tight tracking-tight` | 30px |
| Section label | `font-body text-xs tracking-widest uppercase text-[var(--text-muted)]` | 12px |
| Body copy | `font-body text-base leading-relaxed text-[var(--text-secondary)]` | 16px |
| Data values | `font-mono text-sm text-[var(--text-primary)]` | 14px |
| Nav wordmark | `font-display text-xl tracking-tight text-[var(--text-primary)]` | 20px |

---

## Liquid Glass Classes

Define in `globals.css`. Do not define these in Tailwind utilities.

```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.45) 0%,
    rgba(255, 255, 255, 0.15) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.15) 80%,
    rgba(255, 255, 255, 0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass-strong {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  border: none;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05),
    inset 0 1px 1px rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;
}
.liquid-glass-strong::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.2) 80%,
    rgba(255, 255, 255, 0.5) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.liquid-glass-dark {
  background: rgba(0, 0, 0, 0.4);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}
.liquid-glass-dark::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%,
    rgba(255, 255, 255, 0.1) 80%,
    rgba(255, 255, 255, 0.3) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

---

## Global Base Styles

```css
/* globals.css */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'IBM Plex Sans', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Noise grain overlay — applied globally, sits above all content */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 128px 128px;
  opacity: 0.035;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--border-default); border-radius: 2px; }
```

---

## Framer Motion Entrance Components

Define these in `src/components/ui/`. Use them for all entrance animations. Never use raw opacity+y without blur.

### FadeIn.tsx

```tsx
import { motion } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
}

/**
 * Blur-in fade entrance wrapper. Used for all staggered section reveals.
 * @param delay - Seconds before animation starts
 * @param y - Vertical offset to animate from (default 20px)
 */
export function FadeIn({ children, delay = 0, duration = 0.7, y = 20, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### BlurText.tsx

```tsx
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
}

/**
 * Word-by-word blur-in headline reveal.
 * Each word animates from blur+offset to clear. Used on landing hero headline only.
 * @param delay - Seconds before first word starts animating
 */
export function BlurText({ text, className = '', delay = 0.5 }: BlurTextProps) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap', rowGap: '0.1em' }}>
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={inView ? [
            { filter: 'blur(5px)', opacity: 0.5, y: -5 },
            { filter: 'blur(0px)', opacity: 1, y: 0 }
          ] : {}}
          transition={{ duration: 0.7, times: [0, 1], ease: 'easeOut', delay: delay + (i * 100) / 1000 }}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  )
}
```

---

## Landing Page

### Nav.tsx

Minimal two-item top bar. Argus wordmark left, Connect Wallet right. Fixed at top. Floats over the hero with no background until scroll.

```
Layout: flex, items-center, justify-between
Container: max-w-6xl mx-auto px-8
Position: fixed top-6 inset-x-0 z-50

Left: "Argus" in font-display text-xl tracking-tight text-[var(--text-primary)]
Right: liquid-glass rounded-full px-5 py-2.5 button
  Text: "Connect wallet" in font-body text-sm text-[var(--accent)]
  Hover: text-[var(--accent-hover)] transition-colors

No logo mark. No centre links. No background colour on the nav bar itself.
Logo and favicon: not in this spec. User provides them. Reference via src path only once provided.
```

---

### Section 1: Hero

**Layout:** Split. Left half: copy on `var(--bg-primary)`. Right half: hero image fills the column.

```
<section>: relative min-h-screen grid lg:grid-cols-2
  Left column: flex flex-col justify-center px-8 lg:px-16 py-32
    Background: var(--bg-primary)
  Right column: relative overflow-hidden
    <img src="/images/hero-right.webp" alt="" loading="eager"
      className="absolute inset-0 w-full h-full object-cover object-center" />
    Left-to-right gradient overlay fading image into left side:
      style={{ background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 35%)' }}
```

**Left column copy — stagger sequence:**

```
Badge chip:      delay 0.4s
  liquid-glass rounded-full px-4 py-2 w-fit
  Inner pill: "Built on 0G" in font-body text-xs font-semibold
  Badge text: "Trading research, permanent and on-chain" font-body text-sm text-[var(--text-secondary)]

Headline:        delay 0.5s via BlurText
  Text: "Every thesis. Every signal. On-chain forever."
  Classes: font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--text-primary)]

Sub-headline:    delay 0.8s via FadeIn
  Text: "Argus stores your full research history on 0G Storage and uses 0G Compute to challenge your reasoning before you trade."
  Classes: font-body text-base leading-relaxed text-[var(--text-secondary)] max-w-md mt-4

CTA button:      delay 1.1s via FadeIn
  Primary: liquid-glass-strong rounded-full px-6 py-3 font-body text-sm text-[var(--accent)] hover:text-[var(--accent-hover)]
  Text: "Connect wallet to start"
```

**Right column image entrance:**

```
initial={{ opacity: 0, filter: 'blur(12px)', x: 20 }}
animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}

Ambient glow behind image:
  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  w-[70%] h-[70%] rounded-full -z-10
  background: var(--accent-glow)
  filter: blur(80px)
```

---

### Section 2: Proof Strip

Narrow horizontal band below the hero. Three data points in IBM Plex Mono. Scroll-triggered via `whileInView`.

```
Layout: border-y border-[var(--border-subtle)] py-6
Container: max-w-6xl mx-auto px-8 flex items-center justify-between

Three stat items (distribute evenly):
  "12,400+ analyses stored"
  "3,800+ sessions"
  "0G network live"

Each item:
  font-mono text-sm text-[var(--text-muted)]
  FadeIn delay: 0s, 0.1s, 0.2s respectively

Dividers between items:
  w-px h-4 bg-[var(--border-default)]
```

---

### Section 3: How It Works

Three steps in a horizontal row. No icons. Scroll-triggered stagger.

```
Layout: py-24
Container: max-w-6xl mx-auto px-8
Section label above: "How it works" font-body text-xs tracking-widest uppercase text-[var(--text-muted)] mb-12

Three-column grid: grid lg:grid-cols-3 gap-12

Each step — FadeIn with delay 0s, 0.15s, 0.3s:
  Step number: font-mono text-xs text-[var(--accent-dim)] mb-4
    "01", "02", "03"
  Step heading: font-display text-xl text-[var(--text-primary)] mb-2
  Step body: font-body text-sm leading-relaxed text-[var(--text-secondary)]

Step 1: "Connect your wallet"
  "Open Argus and connect your wallet. Your research history is tied to your address and lives on 0G Storage."

Step 2: "Run your thesis through the AI"
  "Describe your setup. The AI powered by 0G Compute challenges your reasoning, asks questions and surfaces similar past analyses from your vault."

Step 3: "Your research lives on-chain"
  "Every session is stored permanently on 0G Storage with a verifiable on-chain timestamp. Nothing is lost. Nothing can be changed."
```

---

### Section 4: Features

Four cards in a two-by-two grid. Dark surface panels. No icons, no imagery.

```
Layout: py-24 bg-[var(--bg-secondary)]
Container: max-w-6xl mx-auto px-8
Section label: "What Argus does" — same style as above

Grid: grid md:grid-cols-2 gap-4 mt-12

Each card — FadeIn with stagger delay 0s, 0.1s, 0.2s, 0.3s:
  Background: var(--bg-surface)
  Border: 1px solid var(--border-subtle)
  Hover border: var(--border-default), transition-colors duration-200
  Border radius: rounded-2xl
  Padding: p-8
  Shadow on hover: shadow-[0_8px_32px_rgba(0,0,0,0.5)]

Card inner structure:
  Card label: font-body text-xs tracking-widest uppercase text-[var(--accent-dim)] mb-4
  Card headline: font-display text-xl text-[var(--text-primary)] mb-3
  Card body: font-body text-sm leading-relaxed text-[var(--text-secondary)]

Four cards:
  Label "Research" / Headline "Challenge your thesis" / Body "Run any market setup through the AI before you enter. 0G Compute asks the questions a trading partner would ask."
  Label "Vault" / Headline "Every analysis on-chain" / Body "Your full research history stored permanently on 0G Storage. Searchable, immutable, signed by your wallet."
  Label "Journal" / Headline "AI-reviewed signal entries" / Body "Log a structured pre-trade entry. The AI reviews your reasoning and returns approved, flagged or rejected."
  Label "Recall" / Headline "Your history, surfaced" / Body "When you open a new session the AI retrieves relevant past analyses and brings them into the conversation."
```

---

### Section 5: Why 0G

Three columns. One per 0G pillar. No stock imagery. This is the judge-facing proof section.

```
Layout: py-24
Container: max-w-6xl mx-auto px-8
Section label: "Why 0G"
Headline: font-display text-3xl text-[var(--text-primary)] max-w-lg mt-3 mb-16
  "0G is not a feature. It is the infrastructure Argus is built on."

Three columns: grid lg:grid-cols-3 gap-8

Each column — FadeIn with stagger:
  Pillar label: font-mono text-xs text-[var(--accent-dim)] uppercase tracking-widest mb-3
  Pillar name: font-display text-xl text-[var(--text-primary)] mb-4
  Body: font-body text-sm leading-relaxed text-[var(--text-secondary)]
  Separator: w-8 h-px bg-[var(--border-default)] mb-6

Column 1 — "0G Compute"
  "Every AI response in Argus runs on the 0G decentralised compute network. There is no centralised API. The inference is on-chain and verifiable."

Column 2 — "0G Storage"
  "Every research session and journal entry is stored as a file on 0G Storage, signed by your wallet. The root hash is your permanent proof of when the analysis was created."

Column 3 — "0G Chain"
  "Every upload is timestamped on-chain at the block level. Your research history is not just stored, it is provably ordered in time."
```

---

### Section 6: CTA Footer

Full-width. Single headline. One button.

```
Layout: py-32 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)]
Container: max-w-3xl mx-auto px-8 text-center flex flex-col items-center gap-8

Headline — FadeIn delay 0.2s:
  font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight text-[var(--text-primary)]
  Text: "Your research lives on-chain forever."

Button — FadeIn delay 0.5s:
  liquid-glass-strong rounded-full px-8 py-4 font-body text-sm text-[var(--accent)]
  hover:text-[var(--accent-hover)] transition-colors
  Text: "Connect wallet"

Footer strip below:
  border-t border-[var(--border-subtle)] mt-16 pt-8 flex justify-between items-center
  Left: "Argus" font-display text-sm text-[var(--text-muted)]
  Right: "Built for the 0G Zero Cup 2026" font-body text-xs text-[var(--text-muted)]
```

---

## App Interior

### AppNav.tsx

Minimal top bar. No sidebar. Persists across all four app pages.

```
Layout: fixed top-0 inset-x-0 z-50 h-16
Background: var(--bg-secondary) border-b border-[var(--border-subtle)]
Container: max-w-7xl mx-auto px-8 h-full flex items-center justify-between

Left: "Argus" font-display text-lg tracking-tight text-[var(--text-primary)]

Centre: four tab links — font-body text-sm
  "Dashboard", "Research", "Vault", "Journal"
  Inactive: text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors
  Active: text-[var(--text-primary)] with 2px bottom border in var(--accent)
  Spacing: gap-8

Right: wallet status chip
  liquid-glass rounded-full px-4 py-1.5
  Wallet address shortened to first 6 + "..." + last 4 characters
  font-mono text-xs text-[var(--text-secondary)]
  Green dot indicator: w-2 h-2 rounded-full bg-emerald-400 mr-2
```

---

**Mobile nav (below lg breakpoint):**

```
Landing page: no hamburger. The wordmark stays left and the Connect Wallet button stays
right as a smaller pill (px-3 py-1.5 text-xs). Both items fit at all screen widths.

App interior: the top bar tab links are hidden on mobile. A fixed bottom tab bar replaces them.
  Position: fixed bottom-0 inset-x-0 z-50
  Background: var(--bg-secondary) border-t border-[var(--border-subtle)]
  Height: h-16
  Layout: grid grid-cols-4
  Each tab: flex flex-col items-center justify-center gap-1
    Icon: Lucide icon, 20px, colour matches tab state (active: var(--accent), inactive: var(--text-muted))
    Label: font-body text-[10px] tracking-wide uppercase
    Active state: text-[var(--accent)]. Inactive: text-[var(--text-muted)]
  Touch targets: each tab cell is at minimum 44x44px
  Icons per tab: Dashboard (LayoutDashboard), Research (MessageSquare), Vault (Archive), Journal (BookOpen)
```

---

### App Interior Background

Static atmospheric. No animation. Applied as global body background.

```css
/* App page background — atmospheric dark with radial glow */
.app-bg {
  background:
    radial-gradient(
      ellipse 80% 40% at 50% 0%,
      rgba(97, 104, 168, 0.06) 0%,
      transparent 70%
    ),
    var(--bg-primary);
}
```

Apply the `.app-bg` class to the main layout wrapper for all app pages. The noise grain from `body::after` provides the grain texture on top.

---

### Page: Dashboard (/app)

```
Layout: pt-24 pb-16 px-8 max-w-7xl mx-auto

Top row — three stat cards using liquid-glass-strong:
  Grid: grid md:grid-cols-3 gap-4 mb-12
  Each card: p-6 rounded-2xl liquid-glass-strong
    Stat label: font-body text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2
    Stat value: font-display text-4xl text-[var(--text-primary)] tracking-tight leading-none mb-1
    Stat sub: font-body text-xs text-[var(--text-secondary)]
  Cards: "Sessions" / value / "total stored on 0G"
         "Journal entries" / value / "total submitted"
         "Pending review" / value / "awaiting AI critique"

Start research button — below cards, full width on mobile:
  bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)]
  font-body font-medium text-sm rounded-xl px-6 py-3 transition-colors
  Text: "Start research"

Recent sessions list — below button:
  Heading: "Recent sessions" font-body text-sm text-[var(--text-muted)] uppercase tracking-widest mb-4
  Each row: flex items-center justify-between py-4 border-b border-[var(--border-subtle)]
    Left: session date in font-mono text-xs text-[var(--text-muted)], session summary in font-body text-sm text-[var(--text-primary)]
    Right: review status badge (see badge spec below)

Empty state (no sessions):
  Centred card with dashed border border-[var(--border-default)] rounded-2xl p-16
  Heading: font-display text-xl text-[var(--text-secondary)] "No sessions yet"
  Body: font-body text-sm text-[var(--text-muted)] "Start your first research session above and your analysis will appear here."
  No decorative icons or illustrations
```

---

### Page: Research (/app/research)

```
Layout: pt-24 pb-16 px-8 max-w-5xl mx-auto h-screen flex flex-col

Two-panel layout:
  Left panel (flex-1): conversation history and message input
  Right panel (w-80 hidden lg:flex): session summary being built in real time

Left panel:
  Conversation history: scrollable flex-col gap-4
    User messages: bg-[var(--bg-elevated)] rounded-2xl p-4 font-body text-sm text-[var(--text-primary)]
    AI messages: no background, font-body text-sm text-[var(--text-secondary)] leading-relaxed
      AI label above each response: "Argus" font-mono text-xs text-[var(--accent-dim)] mb-2

  Message input fixed at bottom of left panel:
    Border top border-[var(--border-subtle)] pt-4
    Textarea: bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl px-4 py-3
      font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
      focus:border-[var(--accent-dim)] focus:ring-0 outline-none resize-none
      placeholder: "Describe your thesis or ask a question"
    Send button: bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg px-4 py-2 font-body text-sm font-medium

  "Save to vault" button — appears after first AI response:
    Positioned below the conversation, above the input
    liquid-glass rounded-full px-5 py-2 font-body text-sm text-[var(--text-secondary)]
    hover:text-[var(--text-primary)] transition-colors
    Text: "Save to vault"

Right panel (summary sidebar):
  Background: var(--bg-surface), border-l border-[var(--border-subtle)], px-6 pt-6
  Label: "Session summary" font-body text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4
  Live summary of the current session updated as conversation progresses
  font-body text-sm leading-relaxed text-[var(--text-secondary)]

Loading state — while waiting for 0G Compute response:
  Skeleton row: w-full h-4 bg-[var(--bg-elevated)] rounded animate-pulse
  Three skeleton rows stacked with gap-2
  Never a spinner
```

---

### Page: Vault (/app/vault)

```
Layout: pt-24 pb-16 px-8 max-w-5xl mx-auto

Search input at top:
  bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl px-4 py-3
  font-body text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
  focus:border-[var(--accent-dim)] outline-none w-full mb-8
  placeholder: "Search your vault"

Entry list:
  Each entry — FadeIn stagger:
    Container: flex items-start justify-between py-5 border-b border-[var(--border-subtle)]
    Left:
      Type tag: font-mono text-xs text-[var(--accent-dim)] uppercase mb-1 "Session" or "Journal"
      Summary: font-body text-sm text-[var(--text-primary)] leading-snug
      Date + hash: font-mono text-xs text-[var(--text-muted)] mt-1
        "21 Jun 2026 · 0x3f2a..." (truncated storage hash)
    Right: review status badge

Review status badge spec:
  Approved: bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 font-body text-xs
  Flagged:  bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 font-body text-xs
  Rejected: bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3 py-1 font-body text-xs
  Session (no review): hidden

Empty state:
  Same pattern as Dashboard empty state
  Text: "Your vault is empty. Save your first research session and it will appear here."
```

---

### Page: Journal (/app/journal)

```
Layout: pt-24 pb-16 px-8 max-w-2xl mx-auto

Heading: font-display text-2xl text-[var(--text-primary)] mb-8 "Signal journal"

Form fields — stacked, gap-6:
  All inputs: same style as search input above

  Asset: text input, placeholder "BTC, ETH, SOL..."
  Direction: two-button toggle
    Long: active bg-emerald-500/15 text-emerald-400 border-emerald-500/30
    Short: active bg-red-500/15 text-red-400 border-red-500/30
    Inactive: bg-[var(--bg-surface)] text-[var(--text-muted)] border-[var(--border-default)]
    Both: rounded-lg px-6 py-2.5 font-body text-sm border transition-colors
  Entry trigger: textarea, 3 rows, placeholder "What triggered this entry"
  Stop level: text input, placeholder "Price level for invalidation"
  Thesis: textarea, 5 rows, placeholder "Your full reasoning for this trade"
  Confidence: five-star or five-pip rating in accent colour
    Unselected: var(--border-default). Selected: var(--accent-dim). Active: var(--accent)

Submit button:
  bg-[var(--accent)] text-[var(--bg-primary)] rounded-xl px-6 py-3 font-body text-sm font-medium w-full
  hover:bg-[var(--accent-hover)] transition-colors
  Text: "Submit for AI review"

AI review result — appears below submit after response:
  Container: mt-8 p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)]
  Label: "AI review" font-mono text-xs text-[var(--accent-dim)] uppercase tracking-widest mb-3
  Review text: font-body text-sm leading-relaxed text-[var(--text-secondary)]
  Status badge: same spec as vault badges, displayed below review text
  Save button: same liquid-glass rounded-full style as Research page save button
    Text: "Save to vault"
```

---

## Component Rules

- CSS class-based hover states only. No `onMouseEnter` or `onMouseLeave` setting inline styles
- All entrance animations use blur-in pattern: `initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}`
- Skeleton shimmer for all loading states. No spinners
- Every empty state has a heading, a body sentence and a primary action button
- Every error state names what failed and what the user should do next
- No logo mark or favicon is defined in this spec. The user provides those assets
- Data values, wallet addresses and hashes always use `font-mono`
- All copy follows the writing rules: British English, no em dashes, periods only when necessary

---

## Responsive Behaviour

- All layouts collapse to a single column below the `lg` breakpoint (1024px)
- Hero split layout stacks vertically on mobile: copy on top, image below
- Feature grid collapses to single column on mobile
- Why 0G three columns stack to single column on mobile
- All touch targets are at minimum 44x44px
- Hero headline uses `clamp()` so it never overflows on small screens
- App interior adds `pb-16` to all page wrappers on mobile to account for the bottom tab bar height

---

## Animation Rules (from updated skill file Step 16)

**Spring physics for interactive elements:**
Use spring curves instead of cubic-bezier for buttons, modals, drawers and cards.

```typescript
// Correct spring config for interactive elements
transition={{ type: 'spring', stiffness: 300, damping: 25 }}
```

**Exit animations run faster than enter:**
Exit duration must be 60 to 70 percent of the enter duration.

```typescript
// If enter is 0.7s, exit must be 0.42 to 0.49s
transition={{ duration: isExiting ? 0.45 : 0.7 }}
```

**Stagger timing:**
Stagger list and grid items by 30 to 50ms per item. Never all at once. Never more than 80ms per item.

```typescript
// Correct stagger container
variants={{
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } }
}}
```

**All animations must be interruptible:**
Never queue animations or block user input while an animation runs.

**Navigation direction:**
Forward navigation (going deeper) animates new content in from the right. Backward navigation animates in from the left. Apply this to all route transitions in the app interior.

```typescript
// Route transition direction
const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0, filter: 'blur(6px)' }),
  centre: { x: 0, opacity: 1, filter: 'blur(0px)' },
  exit:  (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
}
```

**Reduced motion:**
Wrap all non-essential animations in `prefers-reduced-motion`. Content must remain fully readable if animations are disabled.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Requirements (Priority 1)

These are not optional. Every item below must pass before the build is submitted.

- **Colour contrast:** minimum 4.5:1 for normal text, 3:1 for large text (18px bold or 24px regular). The Signal Indigo palette passes this at all specified text colour pairings against the background tokens
- **Focus states:** visible focus rings on every interactive element using `:focus-visible`. Never remove focus rings. Use `outline: 2px solid var(--accent); outline-offset: 2px` as the standard ring
- **Alt text:** all meaningful images have descriptive alt text. Decorative images use `alt=""`
- **Aria labels:** every icon-only button has an `aria-label`. The mobile bottom tab bar icons each need an aria-label matching their tab name
- **Keyboard navigation:** tab order matches visual reading order. Every interactive element is reachable by keyboard
- **Form labels:** every input in the Journal form has a visible `<label>` with a matching `for` attribute. Never use placeholder as the sole label
- **Skip link:** add a "Skip to main content" link as the first focusable element on every page
- **Heading hierarchy:** use h1 through h6 sequentially. Never skip a level
- **Colour not the only signal:** review status badges use colour plus a text label, never colour alone
- **Focus management:** after a modal opens move focus to the first interactive element inside it. After it closes return focus to the trigger

---

## Performance Requirements (Priority 2)

- **Images:** use WebP for the hero image. Set `loading="eager"` on the hero image (above the fold) and `loading="lazy"` on all others. Always declare `width` and `height` on `<img>` elements to prevent layout shift
- **Font loading:** add `font-display: swap` to the Google Fonts URL by appending `&display=swap` (already included in the URL in the Typography section above)
- **Bundle splitting:** split JavaScript by route using React Router lazy loading so users do not download app page code when viewing the landing page

```typescript
// Route-level code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Research  = lazy(() => import('./pages/Research'))
const Vault     = lazy(() => import('./pages/Vault'))
const Journal   = lazy(() => import('./pages/Journal'))
```

- **Vault list virtualisation:** if the vault grows beyond 50 entries, use `@tanstack/react-virtual` to virtualise the list. Do not render 500 DOM nodes at once
- **Debounce search input:** the vault search input handler must be debounced at 300ms. Never run a filter on every keystroke

```typescript
/**
 * Returns a debounced version of the provided function.
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds before fn is called
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}
```

---

## Step 15 Quality Checklist (Run Before Every Submission)

Run every item below before pushing a build. Fix any failure before it ships.

**Typography:**
- Display font is Spectral, not Inter, Roboto, Arial or Space Grotesk
- Google Fonts import URL is present in index.html
- Heading line-heights are between 0.8 and 1.1
- Large headings have negative letter-spacing between -0.01em and -0.04em

**Navigation:**
- Landing nav uses the confirmed two-item minimal pattern, not the banned logo-left, 3-links-centre, button-right layout
- App interior uses top bar with tabs on desktop and bottom tab bar on mobile
- Nav is at z-50, content sits below it

**Responsive:**
- All layouts collapse to single column on mobile without overflow
- Hero headline does not overflow on a 375px screen
- All touch targets are at minimum 44x44px

**Premium component check:**
- Stat cards use `liquid-glass-strong`, not plain `rgba` backgrounds
- CTA buttons use the `liquid-glass-strong` rounded-full pattern
- Feature cards use the `liquid-glass` or `liquid-glass-dark` pattern with the `::before` gradient border
- No glass-effect component uses a plain `rgba` background without the `::before` pseudo-element border

**Animation check:**
- All entrance animations use blur-in: `filter: blur(8px)` in the initial state, not just `opacity + y`
- Interactive elements (buttons, cards) use spring physics, not cubic-bezier
- Exit animations are 60 to 70 percent of the enter duration
- Stagger delays are between 30 and 50ms per item

**AI slop detection:**
- No section uses the same card layout, padding and spacing as every other section
- Border radius is not `rounded-lg` everywhere. Mix `rounded-2xl`, `rounded-xl` and `rounded-full` intentionally
- The layout has visual tension in at least one section (the hero split, the asymmetric proof strip)
- No element exists purely for decoration without serving the design
- A designer reading the output would not immediately identify it as AI-generated

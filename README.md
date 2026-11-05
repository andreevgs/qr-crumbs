# QR crumbs

A lightweight, serverless single-page application built with React, TypeScript, and Vite for creating and playing interactive gift-hunting QR quests, following the [Material Design 3](https://m3.material.io) specification.

Everything runs entirely in the browser without backends, databases, or external network requests. Each quest step serializes into JSON, compresses into a URL-safe string with `lz-string`, and encodes directly into the URL hash (`#/v/<payload>`).

## Features

- Complies with Material Design 3 Dark Theme tokens, elevation levels, and shape scales without external UI frameworks
- Uses official variable Material Symbols Rounded from Google Fonts via `font-variation-settings`
- Outlined Text Fields with pure CSS floating labels and seamless surface backgrounds
- Three reveal mechanics: immediate text, tap-to-clear scratch blur, and codeword/PIN lock with shake animation
- Optional spoiler accordion for secondary hints accessible once the main riddle is opened
- Two-pane desktop layout with an auto-incrementing step creator and a sticky preview sidebar
- Real-time phone-podium preview matching the exact player experience
- Fullscreen screenshot overlay with high-contrast quiet zone and author placement notes
- Persistent link length and QR readability density indicator
- Mobile MD3 Bottom Navigation Bar with pill indicators for switching between editor, preview, and QR code
- Static deployment ready for GitHub Pages or any sub-path via relative asset paths

## Tech Stack

- React 18, TypeScript, Vite 6
- Vanilla CSS Modules and CSS Custom Properties
- Google Fonts (Roboto and Material Symbols Rounded)
- `lz-string` for URL compression and decompression
- `qrcode.react` for vector SVG QR code generation

## Getting Started

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

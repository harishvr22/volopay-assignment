# SpendNest Revenue Intelligence Inbox

A reviewable, evidence-grounded Revenue Intelligence Inbox application built with React, TypeScript, Vite, and Tailwind CSS.

[![Automated Test Suite](https://img.shields.io/badge/tests-10%2F10%20passing-brightgreen)](#automated-tests)
[![Deployment Ready](https://img.shields.io/badge/deployment-Vercel%20%7C%20Netlify%20%7C%20GitHub%20Pages-blue)](#deployment)

---

## 🚀 Live Demo & Deployment

This project is pre-configured and deployment-ready for:
- **Vercel** (`vercel.json` included with SPA rewrite rules)
- **Netlify** (`netlify.toml` included)
- **GitHub Pages** (`.github/workflows/deploy.yml` included for automated CI/CD)

👉 **For step-by-step deployment instructions, see [DEPLOYMENT.md](file:///d:/candidate-v1.0%20%283%29_layout_fixed%20%281%29%282%29%20%283%29/DEPLOYMENT.md).**

---

## ⚡ Quick Start (Local Run)

### Prerequisites
- Node.js (v18+ recommended; v20/v22 tested)
- npm (v9+)

### Installation & Run
```bash
# 1. Install dependencies
npm --prefix candidate install

# 2. Start local development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Production Build & Preview
```bash
# Build the production bundle
npm run build

# Preview the production bundle locally
npm run preview
```
Visit `http://localhost:4173`.

### Automated Tests
```bash
npm test
```
Runs the 10 mandatory contract tests using Vitest (covering revision replacement, duplicate prevention, M07 late-transcript update, override persistence, and export paths).

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD workflow
├── candidate/                    # Main application source & assessment artifacts
│   ├── src/                      # React + TypeScript + Tailwind source code
│   │   ├── components/           # UI Views (Dashboard, Inbox, Detail, Replay, Brief, Exports)
│   │   ├── lib/                  # Data contracts, state persistence & replay engine
│   │   └── tests/                # 10 Vitest contract tests
│   ├── data/                     # Raw initial and update batch JSON files
│   ├── exports/                  # Staged output manifest, CSVs, analysis markdown
│   ├── presentation/             # Assessment 5-slide pitch deck (PPTX & PDF)
│   ├── growth_associate/         # Supplementary Growth Associate assignment
│   ├── DEMO_SCRIPT.md            # 3-minute narration script and shot list
│   ├── SUBMISSION_CHECKLIST.md   # Official checklist validation
│   └── README.md                 # Detailed candidate technical documentation
├── vercel.json                   # Root Vercel deployment configuration
├── netlify.toml                  # Root Netlify deployment configuration
├── DEPLOYMENT.md                 # Full deployment guide (Vercel, Netlify, GitHub Pages)
├── package.json                  # Workspace scripts (dev, build, preview, test)
└── .gitignore                    # Clean git ignore (dependencies, dist, cache)
```

---

## 📑 Assessment Artifacts & Deliverables

- **Slides Deck**: [`candidate/presentation/Revenue_Intelligence_Inbox_Presentation.pdf`](file:///d:/candidate-v1.0%20%283%29_layout_fixed%20%281%29%282%29%20%283%29/candidate/presentation/Revenue_Intelligence_Inbox_Presentation.pdf) & [`.pptx`](file:///d:/candidate-v1.0%20%283%29_layout_fixed%20%281%29%282%29%20%283%29/candidate/presentation/Revenue_Intelligence_Inbox_Presentation.pptx)
- **Demo Script**: [`candidate/DEMO_SCRIPT.md`](file:///d:/candidate-v1.0%20%283%29_layout_fixed%20%281%29%282%29%20%283%29/candidate/DEMO_SCRIPT.md) (timed 3-minute video voiceover script)
- **Technical Documentation**: [`candidate/README.md`](file:///d:/candidate-v1.0%20%283%29_layout_fixed%20%281%29%282%29%20%283%29/candidate/README.md)
- **Submission Checklist**: [`candidate/SUBMISSION_CHECKLIST.md`](file:///d:/candidate-v1.0%20%283%29_layout_fixed%20%281%29%282%29%20%283%29/candidate/SUBMISSION_CHECKLIST.md)
- **Export Files & Manifest**: Downloadable ZIP directly in the app under **"Exports & Manifest"** or in [`candidate/exports/`](file:///d:/candidate-v1.0%20%283%29_layout_fixed%20%281%29%282%29%20%283%29/candidate/exports/).

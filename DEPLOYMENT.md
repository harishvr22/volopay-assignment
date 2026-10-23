# Deployment Guide — SpendNest Revenue Intelligence Inbox

This repository is pre-configured and 100% deployment-ready for all major hosting platforms:
- **Vercel** (pre-configured with `vercel.json` & SPA rewrites)
- **Netlify** (pre-configured with `netlify.toml`)
- **GitHub Pages** (automated CI/CD via `.github/workflows/deploy.yml`)
- **Render / Static Cloud Hosting**

The application is completely self-contained, statically bundled, and requires **no external database or environment variables**.

---

## Option 1: Deploy to Vercel (Recommended)

### Via Vercel Web Dashboard:
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** > **"Project"**.
3. Select your GitHub repository: `harishvr22/volopay-assignment`.
4. The pre-configured `vercel.json` will automatically set:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `candidate/dist`
   - **Install Command**: `npm --prefix candidate install`
5. Click **"Deploy"**.
6. Your live URL will be ready in under 1 minute!

*(Note: If you choose `candidate` as the Root Directory in Vercel settings, `candidate/vercel.json` ensures it deploys seamlessly as well.)*

---

## Option 2: Deploy to Netlify

### Via Netlify Web Dashboard:
1. Go to [netlify.com](https://netlify.com) and log in.
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select GitHub and pick `harishvr22/volopay-assignment`.
4. Netlify will automatically detect settings from `netlify.toml`:
   - **Base directory**: `candidate`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **"Deploy site"**.

---

## Option 3: Deploy to GitHub Pages (Automated CI/CD)

The repository includes a ready-to-use GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Go to your repository on GitHub: `https://github.com/harishvr22/volopay-assignment`.
2. Go to **Settings** > **Pages** (under "Code and automation").
3. Under **Build and deployment** > **Source**, select:
   - **GitHub Actions**
4. Push your changes to `main` (or click **Actions** > **Deploy to GitHub Pages** > **Run workflow**).
5. Your site will automatically build, test, and be published at:
   `https://harishvr22.github.io/volopay-assignment/`

---

## Option 4: Local Production Preview

To test the exact production bundle locally:

```bash
# 1. Clone repository
git clone https://github.com/harishvr22/volopay-assignment.git
cd volopay-assignment

# 2. Install dependencies
npm --prefix candidate install

# 3. Build production bundle
npm run build

# 4. Preview production build locally
npm run preview
```
Visit `http://localhost:4173` to test the production bundle.

---

## Automated Verification & Tests

To run the full contract test suite:
```bash
npm test
```
All 10 contract tests must pass.

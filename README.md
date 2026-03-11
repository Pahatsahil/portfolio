# React Native Developer Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS for showcasing React Native development expertise.

## Features

- Modern dark theme with React Native cyan color palette
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations using Framer Motion
- Sections: Hero, About, Skills, Experience, Projects, Contact
- Optimized for GitHub Pages deployment

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

### Build for GitHub Pages

```bash
# Build the project
GITHUB_PAGES=true pnpm build
```

The built files will be in the `dist` folder, ready to deploy to GitHub Pages.

## Deployment to GitHub Pages

### Option 1: Manual Deployment

1. Build the project:
   ```bash
   GITHUB_PAGES=true pnpm build
   ```

2. Copy the contents of the `dist` folder to your GitHub repository

3. Go to Repository Settings → Pages

4. Select "Deploy from a branch"

5. Choose the `main` (or `master`) branch and the `dist` folder

6. Click Save

### Option 2: Automatic Deployment with GitHub Actions

The repository includes a GitHub Actions workflow that automatically builds and deploys when you push to main.

1. Go to Repository Settings → Pages

2. Under "Build and deployment", select "GitHub Actions"

3. Push your code to GitHub

4. The workflow will automatically build and deploy your site

## Customization

### Update Your Information

Edit `src/App.tsx` to update:
- Your name in the Hero section
- Experience details
- Project information
- Contact information
- Social media links

### Update Base URL

In `vite.config.ts`, update the base URL to match your repository name:

```typescript
const baseUrl = '/your-repo-name/'
```

### Changing Colors

Edit `src/index.css` to customize:
- Primary color: `#61dafb` (React Cyan)
- Secondary color: `#818cf8` (Indigo)
- Background: `#0f172a` (Dark Navy)

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React Icons

## License

MIT License

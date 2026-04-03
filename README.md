# Fix My Life

Brutal honesty, one click. 500+ quotes from history's greatest minds.

## Features

- 🔥 500+ powerful quotes across 7 categories
- ⚡ Zero login required - instant wisdom
- 💾 Quote history saved locally
- 🎨 Beautiful dark UI with glassmorphism
- 📱 Fully responsive design
- ⚡ Single-file deployment (380 KB)

## Categories

- Mindset
- Relationships
- Career
- Self-Love
- Anxiety
- Motivation
- Healing

## Deployment to GitHub Pages

### Prerequisites
- Node.js 18+
- npm or yarn
- Git installed
- GitHub account

### Local Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/fix-my-life.git
cd fix-my-life
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Deploy to GitHub Pages

1. Push to GitHub's `main` branch:
```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/fix-my-life.git
git push -u origin main
```

2. GitHub Actions will automatically:
   - Build the project
   - Deploy to GitHub Pages
   - Your site will be live at: `https://your-username.github.io/fix-my-life`

3. Configure GitHub Pages (if needed):
   - Go to repository **Settings**
   - Click **Pages** in the sidebar
   - Ensure **Source** is set to **Deploy from a branch**
   - Select **gh-pages** branch and **/root** folder
   - Click **Save**

### Access Your Deployed Site
Your site will be live at: `https://your-username.github.io/fix-my-life`

## Local Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- TypeScript 5
- Lucide React (icons)

## License

MIT

# GitHub Deployment Instructions (No CLI)

## Quick Start - Upload via GitHub Web

### Step 1: Create Repository
1. Visit https://github.com/new
2. Name: `fix-my-life`
3. Choose **Public**
4. Click **Create repository**

### Step 2: Use GitHub CLI or Web Upload

#### Option A: GitHub Desktop (Easiest)
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. Click "Create a New Repository on your Computer"
4. Name: `fix-my-life`
5. Local path: `c:\Users\Administrator\Downloads\fix my life`
6. Click **Create Repository**
7. It will auto-detect changes
8. Write commit message: "Initial commit"
9. Click **Commit to main**
10. Click **Publish repository** (top right)

#### Option B: Manual Web Upload
1. Go to your repo: https://github.com/YOUR-USERNAME/fix-my-life
2. Click **Add file** → **Upload files**
3. Select files (skip `node_modules` and `dist`)
4. Scroll down and click **Commit changes**

### Step 3: Configure GitHub Pages
1. Go to repository **Settings**
2. Click **Pages** (left sidebar)
3. Under Source: select **Deploy from a branch**
4. Select branch: **main**
5. Select folder: **/ (root)**
6. Click **Save**

### Step 4: Enable GitHub Actions
1. Go to **Actions** tab in your repo
2. Click **I understand my workflows, go ahead and enable them**

### Step 5: Access Your Live Site
Your site will be available at:
```
https://YOUR-USERNAME.github.io/fix-my-life
```

(It may take 1-2 minutes for the first deployment)

## Files to Upload
Upload all files EXCEPT:
- ❌ `node_modules` folder
- ❌ `dist` folder
- ✅ Everything else including `.github` folder

## Recommended: Use GitHub Desktop

GitHub Desktop is the easiest way:
https://desktop.github.com/

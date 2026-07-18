# Deployment Guide: FIFA Nexus AI on Vercel

This guide outlines deployment steps to host **FIFA Nexus AI** on the **Vercel** cloud platform.

---

## Prerequisites
1. A **GitHub**, **GitLab**, or **Bitbucket** repository containing this project.
2. A **Vercel** account (free Hobby plan is fully sufficient).
3. (Optional) A Google Cloud Console project with the Gemini API enabled to obtain a `GEMINI_API_KEY`.

---

## Step-by-Step Vercel Deployment

### 1. Push Code to GitHub
Ensure all code edits are committed and pushed:
```bash
git init
git add .
git commit -m "feat: initial commit of FIFA Nexus AI platform"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect Repository on Vercel Dashboard
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your connected Git provider and import the `fifa-nexus-ai` repository.

### 3. Configure Build Settings
Vercel automatically detects Next.js configurations. Ensure settings are:
- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 4. Configure Environment Variables
Expand the **"Environment Variables"** tab and add:
- **Key**: `GEMINI_API_KEY`
- **Value**: `AIzaSy...` *(Your Google Gemini API Key from Google AI Studio)*
*(If this variable is left blank, the platform falls back to the client-side mock chatbot simulator seamlessly, meaning it remains fully interactive.)*

### 5. Deploy
Click **"Deploy"**. Vercel will build the Next.js bundle and assign a public deployment URL (e.g. `fifa-nexus-ai.vercel.app`) in under 2 minutes.

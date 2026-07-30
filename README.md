Option A: Deploy with Vercel (Recommended — Easiest & Fastest)<br>
Go to vercel.com and sign in with your GitHub account.
Click Add New Project > Project.
Select your exported GitHub repository from the list.
Vercel will automatically detect Vite:
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Click Deploy. Your app will be live on a custom .vercel.app URL within a minute and will automatically re-deploy whenever you push changes to GitHub.<br>
Option B: Deploy with Netlify<br>
Go to netlify.com and log in with GitHub.
Click Add new site > Import an existing project > GitHub.
Select your repository.
Netlify auto-configures:
Build command: npm run build
Publish directory: dist
Click Deploy site.<br>
Option C: Deploy with GitHub Pages<br>
If you want to host directly on GitHub (https://<username>.github.io/<repo-name>):
Go to your repository on GitHub.com.
Navigate to Settings > Pages (under Code and automation).
Under Source, choose GitHub Actions.
Click Configure under the Static HTML or Vite starter workflow (or create .github/workflows/deploy.yml).
GitHub will automatically build npm run build and publish your dist folder to GitHub Pages whenever you push code.

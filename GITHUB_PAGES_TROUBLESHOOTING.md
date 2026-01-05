# GitHub Pages Troubleshooting Guide

## 404 Error: "There isn't a GitHub Pages site here"

This error means GitHub Pages hasn't been enabled or the deployment hasn't completed yet. Follow these steps:

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your repository: https://github.com/jahoi12345/Profolio_Website
2. Click **Settings** (top menu bar)
3. Scroll down to **Pages** in the left sidebar
4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (NOT "Deploy from a branch")
   - Do NOT select a branch - leave it as "None" or "GitHub Actions"
5. Click **Save**

### Step 2: Check Workflow Status

1. Go to the **Actions** tab in your repository
2. Look for "Deploy to GitHub Pages" workflow
3. If it shows as failed:
   - Click on the failed run
   - Check the error messages
   - Common issues:
     - Build errors (check the build job logs)
     - Missing dependencies
     - Environment variable issues

### Step 3: Manually Trigger Deployment (if needed)

1. Go to **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click **Run workflow** button (top right)
4. Select branch: **main**
5. Click **Run workflow**

### Step 4: Wait for Deployment

- The workflow takes 2-5 minutes to complete
- After successful deployment, your site will be available at:
  - `https://jahoi12345.github.io/Profolio_Website/`
- It may take a few more minutes for DNS to propagate

### Common Issues

**Issue**: Workflow fails with "Get Pages site failed"
- **Solution**: Make sure GitHub Pages is enabled in Settings → Pages with "GitHub Actions" as the source

**Issue**: Build fails
- **Solution**: Check the build logs in Actions tab for specific errors

**Issue**: Site shows 404 after deployment
- **Solution**: 
  - Verify the base path in `vite.config.js` matches your repo name: `/Profolio_Website/`
  - Clear browser cache
  - Wait 5-10 minutes for DNS propagation

**Issue**: Assets not loading (images, CSS, JS)
- **Solution**: Check that `vite.config.js` has the correct base path with trailing slash

### Verify Your Site is Live

After successful deployment, you should see:
- Green checkmark in Actions tab
- Your site accessible at: `https://jahoi12345.github.io/Profolio_Website/`
- No 404 errors

If you still see 404 after following all steps, check:
1. Repository is public (or you have GitHub Pro/Team for private repos)
2. Workflow completed successfully
3. Base path in vite.config.js is correct


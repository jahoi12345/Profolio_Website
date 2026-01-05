# Troubleshooting Guide

## React Version Error: "Cannot read properties of undefined (reading 'ReactCurrentOwner')"

This error occurs when there's a React version mismatch. Here's how to fix it:

### Step 1: Stop the Dev Server
Press `Ctrl+C` or `Cmd+C` in your terminal to stop the running dev server.

### Step 2: Clear All Caches
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf node_modules/.vite .vite dist

# Reinstall dependencies
npm install --legacy-peer-deps
```

### Step 3: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Step 4: Restart Dev Server
```bash
npm run dev
```

### Step 5: Verify React Versions
Make sure React and React-DOM versions match exactly:
```bash
npm list react react-dom
```

Both should show `18.3.1`.

## If Error Persists

### Option 1: Temporarily Disable Three.js
If Three.js is causing issues, you can temporarily comment out the Canvas components in:
- `src/sections/Hero.jsx`
- `src/sections/Contact.jsx`

### Option 2: Check Browser Console
1. Open DevTools (F12)
2. Check the Console tab for specific error messages
3. Check the Network tab to ensure all files are loading

### Option 3: Verify WebGL Support
Three.js requires WebGL. Check if your browser supports it:
1. Open: https://get.webgl.org/
2. If WebGL is not supported, Three.js components won't work

## React DevTools

Install React DevTools browser extension:
- **Chrome/Edge**: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
- **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/

See `REACT_DEVTOOLS.md` for detailed instructions.

## Common Issues

### Black Screen
- Clear browser cache (see Step 3 above)
- Check browser console for errors
- Verify all dependencies are installed: `npm list`

### Three.js Not Loading
- Check browser console for WebGL errors
- Verify `three`, `@react-three/fiber`, and `@react-three/drei` are installed
- Try disabling Three.js temporarily to see if the rest of the app works

### Styles Not Loading
- Verify Tailwind CSS is configured: `tailwind.config.js` exists
- Check `src/index.css` imports Tailwind directives
- Restart dev server after CSS changes

### Form Not Working
- EmailJS credentials need to be configured in `src/sections/Contact.jsx`
- See `SETUP.md` for EmailJS setup instructions


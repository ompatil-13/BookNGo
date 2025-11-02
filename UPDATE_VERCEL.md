# How to Update Existing Vercel Project with Latest Changes

## Method 1: Automatic Deploy (If Connected to Git) - RECOMMENDED

### Step 1: Commit and Push Your Changes

```bash
cd "/d/DBMS PROJECT"
git add .
git commit -m "Add visual seat selector feature"
git push origin main
# or: git push origin master
```

### Step 2: Vercel Auto-Deploys
- ✅ Vercel will **automatically detect** the new commit
- ✅ It will start a new deployment automatically
- ✅ Go to your Vercel dashboard to see the deployment progress
- ✅ Wait 2-5 minutes for build to complete

**That's it!** Your site will update automatically.

---

## Method 2: Manual Redeploy from Vercel Dashboard

If auto-deploy isn't working:

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Deployments** tab
4. Click the **"..."** menu (three dots) on the latest deployment
5. Select **"Redeploy"**
6. Confirm redeploy
7. Wait for build to complete

---

## Method 3: Update Environment Variables (If Needed)

If you need to update `REACT_APP_API_BASE`:

1. Go to Vercel dashboard → Your project
2. Click **Settings** → **Environment Variables**
3. Find `REACT_APP_API_BASE`
4. Click **Edit** and update the value
5. Save
6. **Important:** Go to **Deployments** and redeploy (environment variables require redeploy to take effect)

---

## Step-by-Step: Complete Update Process

### 1. Verify Your Changes Are Committed

```bash
cd "/d/DBMS PROJECT"
git status
# Should show "nothing to commit" if everything is saved
```

### 2. Push to Git

```bash
git add .
git commit -m "Add visual seat selector feature"
git push origin main
```

### 3. Check Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click on your project
3. You should see:
   - **"Building"** status (deployment in progress)
   - Or go to **Deployments** tab to see new deployment

### 4. Wait for Build to Complete

- Typically takes 2-5 minutes
- Watch the build logs for any errors
- ✅ Green checkmark = Success
- ❌ Red X = Error (check logs)

### 5. Verify Environment Variables

Make sure `REACT_APP_API_BASE` is set correctly:

1. Settings → Environment Variables
2. Should have: `REACT_APP_API_BASE = https://your-backend.onrender.com`
3. If missing or wrong, add/update it
4. Redeploy after updating

### 6. Test Your Updated Site

- Open your Vercel URL
- Register/Login
- Go to Book Ticket
- ✅ Seat selector should appear when you select travel mode

---

## If Auto-Deploy Doesn't Work

### Option A: Force Redeploy

1. Vercel Dashboard → Your Project
2. Deployments → Latest deployment
3. Click "..." → **Redeploy**
4. Select branch (usually `main` or `master`)
5. Click **Redeploy**

### Option B: Disconnect and Reconnect

1. Settings → Git
2. Disconnect repository
3. Reconnect repository
4. This will trigger a fresh deployment

---

## Update Backend on Render (If You Changed Backend Code)

1. Go to https://render.com/dashboard
2. Click your backend service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment (2-5 minutes)

---

## Initialize Seats on Production (After Deployment)

After both frontend and backend are updated, initialize seats:

```bash
# Replace with your actual Render URL
curl -X POST https://your-backend.onrender.com/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Flight\", \"rows\": 20, \"seatsPerRow\": 6}"

curl -X POST https://your-backend.onrender.com/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Bus\", \"rows\": 15, \"seatsPerRow\": 4}"

curl -X POST https://your-backend.onrender.com/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Train\", \"rows\": 25, \"seatsPerRow\": 8}"
```

---

## Quick Checklist

- [ ] Code committed to Git
- [ ] Code pushed to repository
- [ ] Vercel auto-deploying (or manually redeployed)
- [ ] Build successful on Vercel
- [ ] Environment variable `REACT_APP_API_BASE` set correctly
- [ ] Backend updated on Render (if backend code changed)
- [ ] Seats initialized on production backend
- [ ] Tested on live site

---

## Troubleshooting

### Build Fails on Vercel
- Check build logs in Vercel dashboard
- Common issues:
  - Missing dependencies → Check `package.json`
  - Build errors → Check console logs
  - Root directory wrong → Should be `frontend`

### Site Shows Old Version
- Clear browser cache (Ctrl+Shift+R)
- Check Vercel deployment status
- Verify latest deployment is active

### Seat Selector Not Appearing
- Check browser console for errors (F12)
- Verify `REACT_APP_API_BASE` is set correctly
- Check backend API is accessible
- Verify seats are initialized on production

---

**🎉 Once deployment completes, your updated site with seat selector will be live!**



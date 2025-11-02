# Deployment Guide - Vercel (Frontend) + Render (Backend)

## Prerequisites Checklist

- ✅ Backend already deployed on Render
- ✅ Frontend code ready with seat selector feature
- ✅ Git repository set up
- ✅ Node.js 18+ installed locally

---

## Step 1: Commit All Changes to Git

Before deploying, commit your changes:

```bash
# In Git Bash, from project root
cd "/d/DBMS PROJECT"

# Check what files changed
git status

# Add all new/changed files
git add .

# Commit with a message
git commit -m "Add visual seat selector feature with backend seat management"

# Push to your repository (GitHub/GitLab/Bitbucket)
git push origin main
# or: git push origin master
```

**Important Files to Commit:**
- `backend/models/Seat.js` (new)
- `backend/routes/seatRoutes.js` (new)
- `backend/routes/ticketRoutes.js` (updated)
- `backend/server.js` (updated)
- `frontend/src/components/SeatSelector.jsx` (new)
- `frontend/src/styles/seatSelector.css` (new)
- `frontend/src/pages/BookTicket.jsx` (updated)
- `frontend/src/api.js` (updated - if you have changes)

---

## Step 2: Deploy Backend to Render (Update Existing)

### A. Go to Render Dashboard
1. Log in to https://render.com
2. Go to your existing backend service

### B. Update Environment Variables (if needed)
Make sure these are set:
- `MONGO_URI` = Your MongoDB connection string (Atlas or Render MongoDB)
- `JWT_SECRET` = A strong secret key (keep it secret!)
- `PORT` = Usually auto-set by Render (don't change)

### C. Deploy Latest Code
1. Go to **Manual Deploy** section
2. Click **Deploy latest commit**
3. Wait for deployment (2-5 minutes)
4. ✅ Backend should be running at: `https://your-backend.onrender.com`

### D. Test Backend Health
```bash
curl https://your-backend.onrender.com/api/health
# Should return: {"status":"ok"}
```

---

## Step 3: Deploy Frontend to Vercel

### A. Connect Repository to Vercel

**If you haven't connected yet:**

1. Go to https://vercel.com
2. Click **Add New Project**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Select your repository

### B. Configure Project Settings

1. **Framework Preset:** React
2. **Root Directory:** `frontend` (important!)
3. **Build Command:** `npm run build`
4. **Output Directory:** `build`

### C. Set Environment Variables (CRITICAL!)

Click **Environment Variables** and add:

```
REACT_APP_API_BASE=https://your-backend.onrender.com
```

**Replace `your-backend.onrender.com` with your actual Render backend URL!**

**Example:**
```
REACT_APP_API_BASE=https://aadhaar-travel-backend.onrender.com
```

### D. Deploy

1. Click **Deploy**
2. Wait 2-5 minutes for build to complete
3. ✅ Your app will be live at: `https://your-project.vercel.app`

---

## Step 4: Initialize Seats on Production Backend

After deployment, initialize seats on your Render backend:

```bash
# Replace YOUR_BACKEND_URL with your actual Render URL
export BACKEND_URL="https://your-backend.onrender.com"

# Initialize Flight seats (20 rows × 6 seats)
curl -X POST $BACKEND_URL/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Flight\", \"rows\": 20, \"seatsPerRow\": 6}"

# Initialize Bus seats (15 rows × 4 seats)
curl -X POST $BACKEND_URL/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Bus\", \"rows\": 15, \"seatsPerRow\": 4}"

# Initialize Train seats (25 rows × 8 seats)
curl -X POST $BACKEND_URL/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Train\", \"rows\": 25, \"seatsPerRow\": 8}"
```

**Or use Git Bash:**

```bash
# Flight seats
curl -X POST https://your-backend.onrender.com/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Flight\", \"rows\": 20, \"seatsPerRow\": 6}"

# Bus seats
curl -X POST https://your-backend.onrender.com/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Bus\", \"rows\": 15, \"seatsPerRow\": 4}"

# Train seats
curl -X POST https://your-backend.onrender.com/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Train\", \"rows\": 25, \"seatsPerRow\": 8}"
```

**Expected responses:**
```json
{"message":"Initialized 120 seats for Flight"}
{"message":"Initialized 60 seats for Bus"}
{"message":"Initialized 200 seats for Train"}
```

---

## Step 5: Test Production Deployment

### A. Test Backend API

```bash
# Health check
curl https://your-backend.onrender.com/api/health

# Check seats
curl https://your-backend.onrender.com/api/seats?mode_of_travel=Flight
```

### B. Test Frontend

1. Open your Vercel URL: `https://your-project.vercel.app`
2. ✅ Should load without errors
3. Test the flow:
   - Register a new user
   - Login
   - Book Ticket
   - Select Mode of Travel
   - ✅ Seat selector should appear
   - Click on a green seat
   - ✅ Seat should turn blue (selected)
   - Fill travel details and book
   - ✅ Booking should work

### C. Check Browser Console

1. Press F12 → Console tab
2. Look for any errors
3. Check Network tab for API calls
4. ✅ API calls should go to your Render backend URL

---

## Step 6: Fix Database Index on Production (If Needed)

If you get duplicate key errors when initializing seats on production:

### Option A: Using MongoDB Atlas (if you use Atlas)

1. Go to MongoDB Atlas
2. Open MongoDB Shell or use Compass
3. Connect to your database
4. Run:
```javascript
use travelDB
db.seats.dropIndex("seat_no_1")
```

### Option B: Create a Script Endpoint (Temporary)

Add this to your backend temporarily:

```javascript
// In backend/server.js or create a new route
app.post("/api/seats/fix-index", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    await db.collection("seats").dropIndex("seat_no_1");
    res.json({ message: "Index dropped successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
});
```

Then call:
```bash
curl -X POST https://your-backend.onrender.com/api/seats/fix-index
```

---

## Common Issues & Solutions

### Issue: Frontend shows "localhost:5000" errors
**Fix:** Check Vercel environment variables - `REACT_APP_API_BASE` must be set to your Render URL

### Issue: CORS errors
**Fix:** In Render backend, make sure `cors()` is enabled (should already be in your code)

### Issue: "No seats available"
**Fix:** Initialize seats on production backend (Step 4)

### Issue: Backend not responding
**Fix:** 
- Check Render dashboard for errors
- Check MongoDB connection string
- View Render logs

### Issue: Build fails on Vercel
**Fix:**
- Check Root Directory is set to `frontend`
- Check Build Command: `npm run build`
- Check Output Directory: `build`
- View Vercel build logs

---

## Quick Checklist

- [ ] Committed all changes to Git
- [ ] Pushed code to repository
- [ ] Backend updated and deployed on Render
- [ ] Frontend configured on Vercel with correct root directory
- [ ] Environment variable `REACT_APP_API_BASE` set on Vercel
- [ ] Frontend deployed successfully
- [ ] Seats initialized on production backend
- [ ] Tested registration and login
- [ ] Tested seat selector
- [ ] Tested booking flow

---

## Environment Variables Summary

### Render (Backend):
- `MONGO_URI` = MongoDB connection string
- `JWT_SECRET` = Secret key
- `PORT` = Auto-set by Render

### Vercel (Frontend):
- `REACT_APP_API_BASE` = `https://your-backend.onrender.com`

---

**🎉 Once all steps are complete, your app with visual seat selector will be live!**



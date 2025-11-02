# Local Testing Guide - Before Deploying to Vercel

Follow these steps to test the UX locally on your computer.

## Prerequisites
- MongoDB running (local or Atlas connection string)
- Node.js 18+ installed
- Git Bash (or your preferred terminal)

## Step 1: Start Backend Server

```bash
# In Git Bash, navigate to backend folder
cd "/d/DBMS PROJECT/backend"

# Make sure you have a .env file with:
# MONGO_URI=mongodb://127.0.0.1:27017/travelDB
# JWT_SECRET=your-secret-key
# PORT=5000

# Start the backend
npm run dev
# or: npm start

# You should see:
# ✅ MongoDB connected
# ✅ Server running on port 5000
```

**Keep this terminal open!**

## Step 2: Initialize Seats (One-time setup)

Open a **NEW** Git Bash terminal and run:

```bash
# Initialize Flight seats (20 rows × 6 seats per row)
curl -X POST http://localhost:5000/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Flight\", \"rows\": 20, \"seatsPerRow\": 6}"

# Initialize Bus seats (15 rows × 4 seats per row)
curl -X POST http://localhost:5000/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Bus\", \"rows\": 15, \"seatsPerRow\": 4}"

# Initialize Train seats (25 rows × 8 seats per row)
curl -X POST http://localhost:5000/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d "{\"mode_of_travel\": \"Train\", \"rows\": 25, \"seatsPerRow\": 8}"
```

Expected response: `{"message":"Initialized 120 seats for Flight"}` (or similar)

**Verify seats were created:**
```bash
# Check Flight seats
curl http://localhost:5000/api/seats?mode_of_travel=Flight

# Should return JSON array of seats
```

## Step 3: Start Frontend Dev Server

Open a **NEW** Git Bash terminal:

```bash
# Navigate to frontend folder
cd "/d/DBMS PROJECT/frontend"

# Make sure .env file exists with:
# REACT_APP_API_BASE=http://localhost:5000

# Start React dev server
npm start
```

**The browser should automatically open to `http://localhost:3000`**

If not, manually open: http://localhost:3000

## Step 4: Test the Complete UX Flow

### A. Test Registration
1. Go to **Register** page
2. Fill in all fields:
   - Aadhaar No: `123456789012`
   - Name: `Test User`
   - Gender: `Male` or `Female`
   - Email: `test@example.com`
   - Contact: `9876543210`
   - Password: `password123`
3. Click **Register**
4. ✅ Should see success message

### B. Test Login
1. Go to **Login** page
2. Enter:
   - Aadhaar No: `123456789012`
   - Password: `password123`
3. Click **Login**
4. ✅ Should redirect to Book Ticket page

### C. Test Seat Selection UX
1. On **Book Ticket** page, fill in:
   - Mode of Travel: Select **Flight** (or Bus/Train)
   - From: `Mumbai`
   - To: `Delhi`
   - Date: Select any future date
2. ✅ **Seat Selector should appear below**
3. **Visual Check:**
   - 🟩 Green seats = Available (clickable)
   - 🟥 Red seats = Booked (disabled)
   - 🟦 Blue seat = Your selection
4. **Click on a green seat** (e.g., `1A`)
5. ✅ Seat should turn **blue** (selected)
6. ✅ Button should change to "Book Seat 1A"
7. ✅ Selected seat info should appear at bottom

### D. Test Booking
1. Click **"Book Seat [number]"** button
2. ✅ Should see success message: "Ticket booked! ID: [ticket_id]"
3. ✅ Seat selector should refresh (the seat you booked should now be red)
4. ✅ Form should reset

### E. Test Error Handling
1. Try to select and book a **red (already booked) seat**
   - ✅ Should not be clickable
2. Open **another browser/incognito tab** and log in as different user
3. Try to book the **same seat** that's already booked
   - ✅ Should show error: "Sorry, seat already booked. Please choose another seat."
   - ✅ Seat selector should auto-refresh after 1 second

### F. Test Different Modes
1. Change **Mode of Travel** to **Bus** or **Train**
2. ✅ Seat layout should update (different number of seats per row)
3. ✅ All seats should be green initially (if not booked)

### G. Test Mobile Responsive
1. Open browser **Developer Tools** (F12)
2. Toggle **Device Toolbar** (Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone 12)
4. ✅ Seat grid should still be visible and clickable
5. ✅ Layout should adapt to smaller screen

## Step 5: Check for Issues

### ✅ Checklist:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Seats initialized for all 3 modes
- [ ] Can register new user
- [ ] Can login
- [ ] Seat selector appears when mode is selected
- [ ] Green seats are clickable
- [ ] Red seats are not clickable
- [ ] Selected seat turns blue
- [ ] Booking works successfully
- [ ] Booked seat turns red after booking
- [ ] Error handling works (try booking same seat twice)
- [ ] Mobile responsive design works

## Common Issues & Fixes

### Issue: "No seats available for [mode]"
**Fix:** Initialize seats (Step 2)

### Issue: Frontend can't connect to backend
**Fix:** 
- Check backend is running on port 5000
- Check `frontend/.env` has: `REACT_APP_API_BASE=http://localhost:5000`
- Restart frontend after creating/updating .env

### Issue: Seat selector not showing
**Fix:**
- Make sure you selected a Mode of Travel
- Make sure you filled in From, To, and Date fields

### Issue: Seats not updating after booking
**Fix:** 
- The seat selector should auto-refresh
- If not, manually refresh the page

## Step 6: When Everything Works - Deploy to Vercel

Once all tests pass:
1. Set up backend on Render (already done?)
2. Update `frontend/.env.production` or Vercel environment variables:
   ```
   REACT_APP_API_BASE=https://your-backend.onrender.com
   ```
3. Deploy frontend to Vercel
4. Initialize seats on production backend using the same curl commands (replace `localhost:5000` with your Render URL)

---

**Happy Testing! 🎉**



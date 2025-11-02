# Testing Instructions - Seat System

## Step 1: Start Backend

```bash
cd "/d/DBMS PROJECT/backend"
npm run dev
# or: node server.js
```

You should see:
- ✅ MongoDB connected
- ✅ Server running on port 5000

## Step 2: Initialize Seats

In a new terminal:

```bash
curl -X POST http://localhost:5000/api/seats/initialize \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "message": "Seats initialized successfully for all modes",
  "results": {
    "Flight": {
      "deleted": 0,
      "created": 120,
      "expected": 120,
      "columns": 6,
      "rows": 20
    },
    "Bus": {
      "deleted": 0,
      "created": 60,
      "expected": 60,
      "columns": 3,
      "rows": 20
    },
    "Train": {
      "deleted": 0,
      "created": 200,
      "expected": 200,
      "columns": 4,
      "rows": 50
    }
  }
}
```

## Step 3: Verify Seat Counts

```bash
curl http://localhost:5000/api/seats/count
```

**Expected Response:**
```json
{
  "Flight": 120,
  "Bus": 60,
  "Train": 200
}
```

## Step 4: Test Individual Modes

```bash
# Flight seats
curl http://localhost:5000/api/seats/Flight | head -20

# Bus seats
curl http://localhost:5000/api/seats/Bus | head -20

# Train seats
curl http://localhost:5000/api/seats/Train | head -20
```

**Expected:**
- Flight: Should return 120 seats (F1A, F1B, F1C, F1D, F1E, F1F, F2A, ...)
- Bus: Should return 60 seats (B1A, B1B, B1C, B2A, ...)
- Train: Should return 200 seats (T1A, T1B, T1C, T1D, T2A, ...)

## Step 5: Start Frontend

```bash
cd "/d/DBMS PROJECT/frontend"
npm start
```

Browser opens at http://localhost:3000

## Step 6: Test Frontend

1. **Register/Login** to your account
2. Go to **Book Ticket** page
3. Fill in travel details:
   - Mode of Travel: **Flight**
   - From: Any city
   - To: Any city
   - Date: Any future date

4. **Test Flight (120 seats, 6 columns):**
   - ✅ Seat selector should appear
   - ✅ Should show ~20 rows with 6 seats per row (A-F)
   - ✅ Seat numbers should be: F1A, F1B, F1C, F1D, F1E, F1F, F2A, ...
   - ✅ Click a green seat → Should turn blue (selected)
   - ✅ Count should show "Flight: 120 seats (20 rows × 6 columns per row)"

5. **Test Bus (60 seats, 3 columns):**
   - Change Mode of Travel to **Bus**
   - ✅ Should show ~20 rows with 3 seats per row (A-C)
   - ✅ Seat numbers should be: B1A, B1B, B1C, B2A, ...
   - ✅ Count should show "Bus: 60 seats (20 rows × 3 columns per row)"

6. **Test Train (200 seats, 4 columns):**
   - Change Mode of Travel to **Train**
   - ✅ Should show ~50 rows with 4 seats per row (A-D)
   - ✅ Seat numbers should be: T1A, T1B, T1C, T1D, T2A, ...
   - ✅ Count should show "Train: 200 seats (50 rows × 4 columns per row)"

7. **Test Booking:**
   - Select a seat (it turns blue)
   - Click "Book Seat [number]"
   - ✅ Should book successfully
   - ✅ Booked seat should turn red
   - ✅ Other users shouldn't be able to book same seat

## Expected Seat Layouts

### Flight (120 seats)
- **Rows:** 20
- **Columns per row:** 6 (A, B, C, D, E, F)
- **Seat numbering:** F1A, F1B, F1C, F1D, F1E, F1F, F2A, F2B, ... F20F

### Bus (60 seats)
- **Rows:** 20
- **Columns per row:** 3 (A, B, C)
- **Seat numbering:** B1A, B1B, B1C, B2A, B2B, B2C, ... B20C

### Train (200 seats)
- **Rows:** 50
- **Columns per row:** 4 (A, B, C, D)
- **Seat numbering:** T1A, T1B, T1C, T1D, T2A, T2B, ... T50D

## Troubleshooting

### Issue: "No seats available"
**Fix:** Run `POST /api/seats/initialize` first

### Issue: Wrong number of seats
**Fix:** 
1. Check backend logs to see how many seats were created
2. Re-initialize seats: `POST /api/seats/initialize`
3. Verify with: `GET /api/seats/count`

### Issue: Wrong column count
**Fix:** 
- Flight should show 6 columns (A-F)
- Bus should show 3 columns (A-C)
- Train should show 4 columns (A-D)

### Issue: Seats not loading in frontend
**Fix:**
1. Check browser console (F12) for errors
2. Verify backend is running on port 5000
3. Check API call: `GET /api/seats/Flight` should return array
4. Verify `REACT_APP_API_BASE` in frontend `.env` is `http://localhost:5000`

---

**✅ All testing steps complete!**


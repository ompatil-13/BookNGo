# Seat System Refactor - Complete Implementation Guide

## ✅ What Has Been Implemented

### 1. Backend Routes (`backend/routes/seatRoutes.js`)

#### ✅ POST `/api/seats/initialize`
- Deletes all existing seats and recreates them
- Creates seats with distinct numbering:
  - **Flight**: F1, F2, F3, ... F120 (20 rows × 6 columns)
  - **Bus**: B1, B2, B3, ... B60 (15 rows × 4 columns)
  - **Train**: T1, T2, T3, ... T200 (25 rows × 8 columns)
- Uses `Seat.insertMany()` for bulk insertion
- Returns JSON confirmation with counts
- Includes console logs for debugging

#### ✅ GET `/api/seats/:mode`
- Returns all seats for specific mode (Flight, Bus, or Train)
- Sorted by row and column
- Response format: `{ mode, count, seats: [...] }`

#### ✅ GET `/api/seats/count`
- Returns total seat counts per mode
- Response format: `{ Flight: 120, Bus: 60, Train: 200 }`

#### ✅ GET `/api/seats` (with query param)
- Backwards compatible route
- Supports `?mode_of_travel=Flight` query parameter

### 2. Frontend Components

#### ✅ `SeatSelector.jsx`
- Dynamically fetches seats from `/api/seats/:mode`
- Handles different layouts per mode:
  - Flight: 6 columns (A-F)
  - Bus: 4 columns (A-D)
  - Train: 8 columns (A-H)
- Resets and refetches when mode changes
- Shows seat numbers (F1, B1, T1) and column letters
- Efficient loading states

#### ✅ `BookTicket.jsx`
- Already integrated with SeatSelector
- Automatically resets seat selection when mode changes

### 3. Styling

#### ✅ `seatSelector.css`
- Updated seat buttons to show both number and column
- Responsive design for all screen sizes
- Proper spacing for different column counts

### 4. CORS Configuration

#### ✅ `backend/server.js`
- Updated CORS to allow frontend
- Configurable via `FRONTEND_URL` environment variable
- Falls back to allowing all origins in development

---

## 📋 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/seats/initialize` | Delete and recreate all seats |
| GET | `/api/seats/:mode` | Get seats for specific mode (Flight/Bus/Train) |
| GET | `/api/seats/count` | Get total seat counts per mode |
| GET | `/api/seats` | Get all seats (with optional `?mode_of_travel=X` query) |

---

## 🚀 How to Use

### Step 1: Initialize Seats (One-time setup)

```bash
# Initialize all seats at once
curl -X POST http://localhost:5000/api/seats/initialize \
  -H "Content-Type: application/json"
```

**Response:**
```json
{
  "message": "Seats initialized successfully for all modes",
  "results": {
    "Flight": { "deleted": 120, "created": 120, "expected": 120 },
    "Bus": { "deleted": 60, "created": 60, "expected": 60 },
    "Train": { "deleted": 200, "created": 200, "expected": 200 }
  }
}
```

### Step 2: Verify Seat Counts

```bash
curl http://localhost:5000/api/seats/count
```

**Response:**
```json
{
  "Flight": 120,
  "Bus": 60,
  "Train": 200
}
```

### Step 3: Fetch Seats for a Mode

```bash
# Flight seats
curl http://localhost:5000/api/seats/Flight

# Bus seats
curl http://localhost:5000/api/seats/Bus

# Train seats
curl http://localhost:5000/api/seats/Train
```

**Response:**
```json
{
  "mode": "Flight",
  "count": 120,
  "seats": [
    { "seat_no": "F1", "mode_of_travel": "Flight", "row": 1, "column": "A", "isBooked": false },
    { "seat_no": "F2", "mode_of_travel": "Flight", "row": 1, "column": "B", "isBooked": false },
    ...
  ]
}
```

---

## 🎨 Seat Layouts

### Flight (120 seats)
- **Rows**: 20
- **Columns per row**: 6 (A, B, C, D, E, F)
- **Numbering**: F1, F2, F3, ... F120

### Bus (60 seats)
- **Rows**: 15
- **Columns per row**: 4 (A, B, C, D)
- **Numbering**: B1, B2, B3, ... B60

### Train (200 seats)
- **Rows**: 25
- **Columns per row**: 8 (A, B, C, D, E, F, G, H)
- **Numbering**: T1, T2, T3, ... T200

---

## 🔄 Frontend Flow

1. User selects **Mode of Travel** (Flight/Bus/Train)
2. `SeatSelector` component automatically fetches seats from `/api/seats/:mode`
3. Seats are displayed in a grid with:
   - Seat number (F1, B1, T1) - **large text**
   - Column letter (A, B, C, ...) - **small text below**
4. When user switches mode, seats reset and refetch automatically
5. User clicks a seat → Seat turns blue (selected)
6. User books → Seat turns red (booked) and refreshes

---

## 🧪 Testing Checklist

- [ ] Initialize seats: `POST /api/seats/initialize`
- [ ] Verify counts: `GET /api/seats/count`
- [ ] Fetch Flight seats: `GET /api/seats/Flight`
- [ ] Fetch Bus seats: `GET /api/seats/Bus`
- [ ] Fetch Train seats: `GET /api/seats/Train`
- [ ] Test frontend: Select Flight → See 6 columns per row
- [ ] Test frontend: Select Bus → See 4 columns per row
- [ ] Test frontend: Select Train → See 8 columns per row
- [ ] Test booking: Book a seat → Seat turns red
- [ ] Test mode switch: Change mode → Seats reset and refetch

---

## 📝 Notes

- Seat numbering is unique per mode (F1, B1, T1 can all exist)
- Compound unique index on `(seat_no, mode_of_travel)` prevents duplicates
- Seat selector automatically handles mode changes
- All seats show both number and column letter
- CORS is configured to allow your frontend

---

## 🐛 Troubleshooting

### Issue: "Invalid mode" error
**Fix**: Use exactly "Flight", "Bus", or "Train" (case-sensitive)

### Issue: Seats not showing in frontend
**Fix**: 
1. Initialize seats first: `POST /api/seats/initialize`
2. Check browser console for API errors
3. Verify backend is running

### Issue: Wrong number of columns
**Fix**: 
- Flight should show 6 columns (A-F)
- Bus should show 4 columns (A-D)
- Train should show 8 columns (A-H)

---

**✅ All features implemented and ready to use!**


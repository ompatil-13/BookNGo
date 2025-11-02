# Seat Setup Instructions

## Initializing Seats in Database

Before users can book tickets, you need to initialize seats for each mode of travel (Flight, Bus, Train).

### Option 1: Using the API Endpoint (Recommended)

Use the initialize endpoint to create seats:

```bash
# Initialize Flight seats: 20 rows, 6 seats per row (A-F)
curl -X POST http://localhost:5000/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d '{"mode_of_travel": "Flight", "rows": 20, "seatsPerRow": 6}'

# Initialize Bus seats: 15 rows, 4 seats per row (A-D)
curl -X POST http://localhost:5000/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d '{"mode_of_travel": "Bus", "rows": 15, "seatsPerRow": 4}'

# Initialize Train seats: 25 rows, 8 seats per row (A-H)
curl -X POST http://localhost:5000/api/seats/initialize \
  -H "Content-Type: application/json" \
  -d '{"mode_of_travel": "Train", "rows": 25, "seatsPerRow": 8}'
```

### Option 2: Using MongoDB Shell

If you prefer to initialize seats directly in MongoDB:

```javascript
db.seats.insertMany([
  // Flight seats - Example: 20 rows x 6 seats
  ...Array.from({length: 20}, (_, row) => 
    ['A', 'B', 'C', 'D', 'E', 'F'].map(col => ({
      seat_no: `${row + 1}${col}`,
      mode_of_travel: 'Flight',
      row: row + 1,
      column: col,
      isBooked: false
    }))
  ).flat(),
  
  // Bus seats - Example: 15 rows x 4 seats
  ...Array.from({length: 15}, (_, row) => 
    ['A', 'B', 'C', 'D'].map(col => ({
      seat_no: `${row + 1}${col}`,
      mode_of_travel: 'Bus',
      row: row + 1,
      column: col,
      isBooked: false
    }))
  ).flat(),
  
  // Train seats - Example: 25 rows x 8 seats
  ...Array.from({length: 25}, (_, row) => 
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(col => ({
      seat_no: `${row + 1}${col}`,
      mode_of_travel: 'Train',
      row: row + 1,
      column: col,
      isBooked: false
    }))
  ).flat()
]);
```

### Option 3: Using Postman or Similar Tools

1. Create a POST request to `http://localhost:5000/api/seats/initialize`
2. Set Content-Type to `application/json`
3. Send body:
```json
{
  "mode_of_travel": "Flight",
  "rows": 20,
  "seatsPerRow": 6
}
```

## Verifying Seats

Check if seats were created successfully:

```bash
# Get all Flight seats
curl http://localhost:5000/api/seats?mode_of_travel=Flight

# Get all seats (all modes)
curl http://localhost:5000/api/seats
```

## Seat Numbering Format

Seats are numbered using the format: `{row}{column}`

Examples:
- `1A`, `1B`, `1C` (Row 1, columns A, B, C)
- `10D`, `10E`, `10F` (Row 10, columns D, E, F)
- `25H` (Row 25, column H)

## Notes

- The initialize endpoint uses `bulkWrite` with `upsert: true`, so it won't create duplicates if run multiple times
- Each seat is unique per `mode_of_travel` (same seat number can exist for Flight, Bus, and Train)
- When a seat is booked, its `isBooked` field is set to `true`
- To reset all seats (make them available again), you can update the database:
  ```javascript
  db.seats.updateMany({}, { $set: { isBooked: false } })
  ```


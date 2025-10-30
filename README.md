## Aadhaar-Linked Travel Ticket Booking System

Tech stack: React (plain CSS) + Node/Express + MongoDB (local) + JWT

### Prerequisites
- Node.js 18+
- Local MongoDB running (`mongodb://127.0.0.1:27017`)

### Setup
1) Install dependencies (root runs both dev servers with concurrently):
```
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

2) Create backend environment file at `backend/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/travelDB
JWT_SECRET=myLocalSecretKey
PORT=5000
```

3) Start development servers (backend:5000, frontend:3000):
```
npm run dev
```
Or run separately:
```
npm run server
npm run client
```

### API Endpoints
- POST `/api/users/register`
- POST `/api/users/login`
- GET `/api/users/:aadhaar_no`
- POST `/api/tickets/book` (JWT)
- GET `/api/tickets/user/:aadhaar_no` (JWT)

### Frontend Pages
- Home, Register, Login, Book Ticket, My Bookings, Navbar

JWT is stored in localStorage. Booking auto-fills profile via Aadhaar lookup.


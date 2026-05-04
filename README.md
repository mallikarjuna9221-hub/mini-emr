# Mini-EMR & Patient Portal

A full-stack web application with two sections:
- **Admin EMR** — providers manage patients, appointments, and prescriptions
- **Patient Portal** — patients log in to view their health data

---

## Sections & URLs

### Patient Portal — `/`
Where patients log in and view their information.

### Admin EMR — `/admin`
No login required. Providers can manage all patient data from here.


**Demo login credentials:**
| Name | Email | Password |
|------|-------|----------|
| Mark Johnson | `admin@admin.com` | `<password>` |


---


| Page | URL | What you can do |
|------|-----|-----------------|
| Patient List | `/admin` | See all patients with appointment and prescription counts |
| Patient Detail | `/admin/patients/:id` | View a patient's appointments and prescriptions |
| New Patient | `/admin/patients/new` | Create a new patient (name, email, password) |
| Edit Patient | `/admin/patients/:id/edit` | Update patient info |
| New Appointment | `/admin/patients/:id/appointments/new` | Schedule an appointment (with repeat options) |
| Edit Appointment | `/admin/patients/:id/appointments/:apptId/edit` | Change or end a recurring appointment |
| New Prescription | `/admin/patients/:id/prescriptions/new` | Prescribe a medication |
| Edit Prescription | `/admin/patients/:id/prescriptions/:rxId/edit` | Update a prescription |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite, React Router, CSS Modules |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (free cloud hosted) |


---

## How to Run Locally

### Prerequisites

### Step 1 — MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free cluster
2. Under **Database Access**, create a user with a username and password
3. Under **Network Access**, add `0.0.0.0/0` to allow connections from anywhere
4. Click **Connect → Drivers** and copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
   ```

---

### Step 2 — Configure the Server

Inside the `server/` folder, create a file called `.env`:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mini-emr?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here
PORT=3001
```

Replace `<username>` and `<password>` with your Atlas credentials.

---

### Step 3 — Seed the Database

This loads the two demo patients, medications list, and dosages into MongoDB.

```
cd server
npm install
node seed.js
```

You should see: `Seed complete: 2 users, medications, dosages`

---

### Step 4 — Start the Server

```
cd server
node index.js
```

You should see:
```
Connected to MongoDB
Server running on port 3001
```

---

### Step 5 — Start the Frontend

Open a **new terminal** and run:

```
cd client
npm install
npm run dev
```

You should see:
```
Local: http://localhost:5173/
```

---

### Step 6 — Open the App

| Section | URL |
|---------|-----|
| Patient Portal (login) | http://localhost:5173 |
| Admin EMR | http://localhost:5173/admin |

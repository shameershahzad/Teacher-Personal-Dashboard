# Teacher Personal Dashboard

A personal dashboard for teachers to efficiently manage their classes and students.

**Features:**
- Manage students and their details
- Create and organize class schedules (timetable)
- Track attendance
- Secure authentication using JWT
- Fully personal use for teachers

Built with the MERN stack (MongoDB, Express, React, Node.js), this system provides an easy-to-use interface for teachers to handle daily academic tasks in one place.

## Project structure

```
Backend/    Express + MongoDB API (port 3003)
Frontend/   React + Vite client (port 5173)
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- A MongoDB database either a local install or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/shameershahzad/Teacher-Personal-Dashboard.git
cd Teacher-Personal-Dashboard
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Copy the example environment file and fill in your own values:

```bash
cp .env.example .env
```

`Backend/.env`:

| Variable     | Description                                  |
|--------------|-----------------------------------------------|
| `MONGO_URI`  | MongoDB connection string                     |
| `JWT_SECRET` | Any long random string used to sign JWTs      |
| `PORT`       | Port for the API server (defaults to `3003`)  |

Start the API:

```bash
npm run dev
```

You should see `DB Connected` and `Server is running at port: 3003` in the terminal.

### 3. Frontend setup

In a separate terminal:

```bash
cd Frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`. It talks to the API at `http://localhost:3003` by default, so make sure the backend is running first.

## Available scripts

**Backend** (`Backend/package.json`)
- `npm run dev` start the API with nodemon (auto-restart on changes)

**Frontend** (`Frontend/package.json`)
- `npm run dev` start the Vite dev server
- `npm run build` build for production
- `npm run lint` run ESLint
- `npm run preview` preview the production build locally

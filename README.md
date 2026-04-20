# Full-Stack Cyberpunk Event Platform

A comprehensive, full-stack application designed to revolutionize the **Physical Event Experience** at large-scale sporting venues, tech expos, and music festivals. 

This platform acts as a digital nexus, allowing attendees to bypass physical congestion via digital queuing, view holographic-styled maps for venue navigation, and receive real-time density alerts. 

## 🌃 Aesthetic & Architecture

- **Frontend (`/frontend`)**: A visually stunning, mobile-first React application built using Vite. It features a heavy Cyberpunk aesthetic with deep dark themes, glassmorphism overlays, neon glowing accents, and dynamic grid matrices.
- **Backend (`/backend`)**: A robust Django REST Framework (DRF) API. Provides full CRUD operations for `Events`, `Orders`, `Places/Zones`, and `Alerts`, secured natively using JSON Web Tokens (JWT).

## 🚀 Quick Start Guide

You will need to run the Django backend server and the React frontend development server simultaneously.

### 1. Launching the Backend API
Navigate into the backend directory and fire up the python environment.

```bash
cd backend

# Create and activate your virtual environment (Windows)
python -m venv venv
.\venv\Scripts\activate

# Install all Django dependencies (including SimpleJWT and CORS headers)
pip install -r requirements.txt

# Migrate the database schema
python manage.py makemigrations api
python manage.py migrate

# Seed the database with Cyberpunk Events and Demo Users!
python seed_data.py

# Start the internal server on port 8000
python manage.py runserver
```

### 2. Launching the React Frontend
Open a **new terminal window**, navigate to the frontend directory, and run Vite.

```bash
cd frontend

# Install Node modules
npm install

# Start the dev server
npm run dev
```

### 3. Enter the Matrix (Demo Intructions)
1. Navigate to whichever `localhost` port Vite gives you (usually `http://localhost:5173/`).
2. You will be greeted by the **Events Portal** dynamically loaded from the backend.
3. Select an Event to open its Grid Navigation and Service Nodes.
4. Go to the **Sync** tab and use the pre-filled mock credentials (`demo` / `password123`) to Securely Login.
5. Watch the JWT authentication handshake occur in real-time, instantly rendering your historical Event Ticket and Node orders!

## 🛠 Tech Stack
* **Frontend**: React 18, Vite, Lucide-React (Icons), Vanilla CSS (Custom Variables/Animations)
* **Backend**: Django 5, Django REST Framework, SimpleJWT Auth, SQLite (Local Dev)

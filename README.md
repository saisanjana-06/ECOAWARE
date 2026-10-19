# 🌿 EcoAware — Environmental Awareness Website

## About the Project
EcoAware is a web-based application designed to promote environmental awareness and encourage sustainable habits. It provides educational information about environmental issues and an interactive quiz to test users' knowledge.

## Features
- 🌍 Environmental awareness and educational content
- 📚 Learn More sections with informative topics
- 📝 Interactive environmental quiz with 8 questions
- ✅ Automatic answer evaluation and score calculation
- 📊 Quiz results with score, percentage, and answer review
- 💻 User-friendly website interface

## Technologies Used
- **Frontend:** React, Vite, CSS
- **Backend:** Python, FastAPI
- **Database:** SQLite

## How to Run Locally

### 1. Start the Backend
Open a terminal in the `backend` directory and run:

```bash
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

### 2. Start the Frontend
Open another terminal in the frontend directory and run:

```bash
npm install
npm run dev
```

Open the local URL displayed in the frontend terminal in your browser.

## Project Structure
- `backend/` — Backend application and database logic
- `src/` — Frontend source code
- `environmental.db` — SQLite database
- `run_ecoaware.bat` — Windows launcher script

## Purpose
The purpose of EcoAware is to spread environmental knowledge and help users understand how everyday choices can contribute to a healthier planet.

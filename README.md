# WeSafe (RECLAIM)
> **AI-Powered Digital Evidence Preservation, Anti-Tamper Forensic Vault & Court Dossier Engine for Women Facing Cyberstalking, Harassment, and NCII.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Section 63 BSA Certified](https://img.shields.io/badge/Indian_Evidence_Act-BSA_§63_Certified-rose.svg)](#legal-compliance)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

---

## 🌸 Overview

**WeSafe** is a trauma-informed digital forensics and survivor safety platform. Victims of stalking, digital harassment, and non-consensual image extortion (NCII) frequently face two critical barriers:
1. **Admissibility Barrier:** Police and courts frequently dismiss raw screenshots as easily faked or manipulated with "Inspect Element".
2. **Safety Barrier:** Gathering and organizing evidence takes hours while living in fear of immediate physical or digital retribution.

WeSafe bridges this gap by transforming mobile screenshots into **court-ready, cryptographically sealed evidence passports** adhering to **Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 (BSA)** and **Section 65B of the Indian Evidence Act, 1872**.

---

## ✨ Key Features

- **🛡️ Forensic Anti-Tamper Sealing (SHA-256 & Merkle Tree):**
  - WebCrypto calculates cryptographic SHA-256 hashes in browser memory *before* transmission.
  - The server verifies bit-exact integrity and computes a pairwise **Master Merkle Root Hash** for the entire case.
- **📱 Authentic Mobile Evidence Exhibits:**
  - True-to-life mobile screen frames for **WhatsApp**, **Call Logs** (nocturnal call flooding), **Instagram Direct** (block evasion burners), and **LinkedIn InMail** (workplace coercion).
- **⚖️ Section 63 BSA / 65B Certified Court Passport (PDF):**
  - Dedicated Python ReportLab engine compiles a formal, court-admissible PDF dossier citing exact timestamps, device IMEI/iOS signatures, and criminal statutes.
- **🚨 Survivor Safety Panic Button (Quick Exit):**
  - Pressing <kbd>ESC</kbd> twice or clicking **Quick Exit** immediately wipes all local browser memory and redirects to Google Weather.
- **🖼️ Zero-Upload Perceptual Image Shield:**
  - In-memory perceptual hashing (`dHash` / `aHash`) computes invariant mathematical signatures to detect non-consensual image distribution even if cropped or filtered.
- **⚡ 1-Click Platform Takedown Requests:**
  - Generates pre-filled statutory takedown demands citing cryptographic exhibit hashes ready for Meta, WhatsApp, and LinkedIn abuse teams.
- **🛟 24/7 Verified Crisis Helplines:**
  - One-click access to National Cyber Crime Helpline (**1930**), Women's Helpline (**1091**), and StopNCII.org.

---

## 🏛️ Legal Statutes Mapped

| Statute | Description | Proven By |
|---|---|---|
| **BNS §78 (formerly IPC 354D)** | Criminal Stalking & Electronic Monitoring | WhatsApp transit tracking & block evasion |
| **BNS §79** | Insulting Modesty / Harassment Barrage | 18 unanswered calls between 23:10 and 23:42 |
| **IT Act §66E** | Violation of Bodily Privacy | Image extortion threats |
| **IT Act §67A** | Sexually Explicit Material Blackmail | Non-consensual image distribution ultimatums |
| **BSA 2023 §63 (IEA §65B)** | Electronic Evidence Certificate | SHA-256 Merkle Root & Device Affinity Seal |

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 2. Backend Setup
```bash
# Navigate to backend and create virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```
Backend will be live at `http://127.0.0.1:8000`. Swagger API docs available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend
cd frontend

# Install packages
npm install

# Start Vite dev server
npm run dev
```
Frontend will be live at `http://localhost:5173`.

---

## 🐳 Docker Deployment (One-Command)

To run the entire stack inside isolated containers:
```bash
docker compose up --build -d
```
- **Web Interface:** `http://localhost:5173`
- **Backend API:** `http://localhost:8000`

---

## ☁️ Cloud Deployment

### Backend (Render / Railway)
- **Root Directory:** `backend`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel / Netlify)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_BASE_URL=https://your-backend.onrender.com/api`

---

## 🔒 Privacy & Data Sovereignty
* **Zero Invasive Device Permissions:** WeSafe never asks for phone permissions, contacts, or carrier records. Evidence is strictly based on screenshots manually uploaded by the user.
* **Deterministic Intelligence:** All cryptographic proofs, timeline parsers, and PDF engines run with zero external cloud dependencies if no API key is provided.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
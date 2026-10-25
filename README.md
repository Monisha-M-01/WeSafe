# 🌸 WeSafe (RECLAIM)
> **A secure digital evidence preservation and forensic protection platform for women facing online harassment, stalking, and cyber threats.**

---

## 💡 What is WeSafe?

When someone experiences online harassment, cyberstalking, or blackmail, collecting credible evidence is challenging. Victims often take screenshots on their phones, but police, cyber cells, and courts frequently dismiss raw screenshots because they can easily be faked or altered.

**WeSafe** bridges this gap. It helps survivors safely log screenshots, automatically arranges them into an organized timeline, generates tamper-proof cryptographic proofs, and compiles a **court-ready legal PDF report** that can be directly submitted to law enforcement or legal counsel.

---

## 🛡️ Forensic Workspace & Platform Modules

The WeSafe **Forensic Investigation Console** provides an integrated environment to secure digital evidence, analyze threats, and prepare legal documentation. Here is what each module does:

### 1. 📤 Cryptographic Evidence Ingestion Engine
* **What it does:** Allows users to ingest screenshots from WhatsApp, Instagram, call logs, SMS, or emails.
* **Why it matters:** As soon as an exhibit is selected, the browser immediately computes a SHA-256 cryptographic hash in memory. This generates a permanent digital seal proving the screenshot has not been edited or altered since capture.

### 2. 📅 Interactive Incident Timeline Reconstruction
* **What it does:** Automatically arranges every message, phone call, and screenshot into a chronological sequence.
* **Why it matters:** It identifies behavioral anomalies such as nocturnal calling bursts (e.g., 20 calls at 2 AM) and threat escalation patterns, making it easy to demonstrate repeated and sustained harassment.

### 3. 🎯 Harassment Pattern Radar & Legal Statute Mapping
* **What it does:** Automatically detects patterns like nocturnal contact, block-evasion burner accounts, and extortion threats.
* **Why it matters:** It maps these behaviors directly to relevant legal sections (including Bharatiya Nyaya Sanhita stalking provisions and IT Act privacy violations), showing exactly which legal statutes apply to the offenses.

### 4. 🕸️ Cross-Platform Persona Correlation Map
* **What it does:** Visualizes relationships between multiple handles, phone numbers, and communication channels.
* **Why it matters:** Stalkers frequently create burner accounts across Instagram, WhatsApp, and email. The correlation map links these disparate identifiers together to establish that they originate from the same actor.

### 5. 🖼️ Zero-Upload Perceptual Image Shield
* **What it does:** Safeguards private photos without ever uploading the raw images to a remote server.
* **Why it matters:** It calculates invariant mathematical fingerprints (`pHash` / `dHash`) directly on the local device. Users can scan suspicious media found online to identify matches even if the attacker cropped, compressed, or applied visual filters.

### 6. 📄 Certified Court Passport Compiler (PDF Engine)
* **What it does:** Compiles verified exhibits, cryptographic hashes, and timeline data into a formal, certified PDF dossier with a single click.
* **Why it matters:** Cites exact timestamps, device attributes, and statutory evidence certifications (adhering to Section 63 of Bharatiya Sakshya Adhiniyam, 2023 / Section 65B of Indian Evidence Act) for formal FIR submission.

### 7. ⚡ Platform Takedown & Incident Response Assistant
* **What it does:** Formulates structured response checklists and statutory takedown demands.
* **Why it matters:** Produces pre-drafted legal notices citing exhibit hash proofs for trust and safety teams at Meta, Instagram, or WhatsApp, while providing direct contacts for national emergency cyber helplines (**1930** and **1091**).

### 8. 🚨 Emergency Concealment Trigger (Quick Exit)
* **What it does:** A persistent trigger (or pressing <kbd>ESC</kbd> twice) immediately clears local session state and redirects the browser to a neutral destination (such as Google Weather) if privacy is compromised.

---

## 🛠️ Technology Stack & Architecture

WeSafe is built using modern, production-grade technologies organized into three primary layers:

### 🎨 Frontend Layer
* **React 18 & TypeScript:** Delivers a responsive, strongly-typed user interface.
* **Vite:** Modern bundler offering fast development and optimized production builds.
* **Tailwind CSS & Lucide React:** Provides a clean, accessible forensic UI design system.
* **WebCrypto API:** Computes client-side SHA-256 hashes inside browser memory before transmission for tamper-evidence.

### ⚙️ Backend & Forensic Services
* **Python & FastAPI:** High-throughput asynchronous REST API driving the evidence ingestion and routing pipeline.
* **SQLAlchemy & SQLite:** Structured persistence layer managing case records, exhibit metadata, and audit logs.
* **ReportLab:** Programmatic PDF generation engine constructing multi-page, court-admissible forensic dossiers.
* **Pillow & ImageHash:** Calculates difference and perceptual image hashes (`dHash`, `pHash`) for the zero-upload Image Shield.
* **Google Gemini AI (optional):** Evaluates unstructured threat communications and assists in generating context-aware response strategies.

### 🚀 Hosting & Infrastructure
* **Frontend Hosting:** Deployed on **Vercel** with single-page application (SPA) rewrites.
* **Backend Hosting:** Deployed on **Render** using FastAPI and Uvicorn.
* **Containerization:** Ready for containerized deployment via `docker-compose.yml`.

---

## 🏃 Quick Start (Local Setup)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API server runs at `http://127.0.0.1:8000`. Swagger documentation available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Client application runs at `http://localhost:5173`.

---

## 🔒 Privacy & Data Sovereignty
* **Zero Invasive Device Permissions:** WeSafe never requests access to personal contacts, device storage trees, or carrier logs.
* **Client-Side Hashing:** Cryptographic proofs and perceptual fingerprints are calculated locally on the user's device.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
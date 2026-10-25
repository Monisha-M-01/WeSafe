from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import cases, evidence, image_shield, response_assistant, passport

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="RECLAIM — AI Digital Safety & Evidence Response Platform",
    description="Cryptographic Evidence Ingestion, Multimodal Harassment Pattern Detection, Zero-Upload Image Shield, and Court-Ready Evidence Passport PDF Engine.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(cases.router)
app.include_router(evidence.router)
app.include_router(image_shield.router)
app.include_router(response_assistant.router)
app.include_router(passport.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RECLAIM Backend API",
        "version": "1.0.0"
    }

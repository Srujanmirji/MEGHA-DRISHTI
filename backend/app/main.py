from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="MEGHA-DRISHTI Guidance API",
    version="0.1.0",
    description="Research prototype API for ensemble extreme-weather guidance.",
)


class HealthResponse(BaseModel):
    status: str
    mode: str


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", mode="research-prototype")


@app.get("/v1/about")
def about() -> dict:
    return {
        "project": "MEGHA-DRISHTI",
        "ps_id": "26078",
        "warning": "Research guidance only; not an operational public alert system.",
        "pipeline": [
            "ensemble ingest",
            "extreme detection",
            "spatio-temporal tracking",
            "member-wise downscaling",
            "consistency checks",
            "skill-aware probability footprints",
        ],
    }

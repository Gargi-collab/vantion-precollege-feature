from __future__ import annotations

from pathlib import Path
from typing import Literal

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from db import get_history, get_history_summary, get_sender_report_stats, init_db, save_history, save_report
from model import analyze_message


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"


class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Raw SMS message")
    sender_number: str | None = Field(default=None, description="Optional sender identifier")


class PredictResponse(BaseModel):
    label: Literal["spam", "ham"]
    confidence: float
    risk_level: Literal["low", "medium", "high"]
    spam_type: str
    signals: list[str]
    reasoning: str
    report_count: int
    frequently_reported: bool
    link_safety: Literal["safe", "suspicious"] | None
    recommended_action: Literal["block", "ignore", "review"]


class ReportRequest(BaseModel):
    text: str = Field(..., min_length=1)
    sender_number: str | None = None
    spam_type: str = "unknown"
    risk_level: Literal["low", "medium", "high"] = "medium"
    reasoning: str = "Reported by user from the frontend action panel."
    action: Literal["block", "report"] = "report"


class ReportResponse(BaseModel):
    sender_number: str
    report_count: int
    frequently_reported: bool
    status: str


init_db()

app = FastAPI(
    title="SignalSMS",
    summary="Action-oriented SMS spam intelligence demo built with FastAPI and a dark single-page frontend.",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/assets", StaticFiles(directory=FRONTEND_DIR), name="assets")

SAMPLE_MESSAGES = [
    {
        "title": "Phishing Link",
        "sender_number": "+1 (855) 204-9911",
        "message": "URGENT: Verify your account now at https://bit.ly/secure-login to avoid suspension.",
    },
    {
        "title": "Lottery Scam",
        "sender_number": "+44 7700 900123",
        "message": "Congratulations! You WIN a cash prize today only. Claim immediately!!!",
    },
    {
        "title": "Normal Message",
        "sender_number": "+1 (480) 555-1222",
        "message": "Hey, are we still meeting for coffee tomorrow after class?",
    },
]


@app.get("/", include_in_schema=False)
def index() -> FileResponse:
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "SignalSMS"}


@app.get("/examples")
def examples() -> dict[str, list[dict[str, str]]]:
    return {"examples": SAMPLE_MESSAGES}


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest) -> PredictResponse:
    # Shared sender intelligence is folded into every prediction before it is stored.
    sender_stats = get_sender_report_stats(payload.sender_number)
    result = analyze_message(
        text=payload.text,
        report_count=sender_stats["report_count"],
        frequently_reported=sender_stats["frequently_reported"],
    )
    save_history(sender_number=sender_stats["sender_number"], message_text=payload.text, result=result)
    return PredictResponse(**result)


@app.post("/report", response_model=ReportResponse)
def report_message(payload: ReportRequest) -> ReportResponse:
    # Reports and block actions both land in the same local intelligence store.
    sender_stats = save_report(
        sender_number=payload.sender_number,
        message_text=payload.text,
        spam_type=payload.spam_type,
        risk_level=payload.risk_level,
        reasoning=payload.reasoning,
        action=payload.action,
    )
    return ReportResponse(
        sender_number=sender_stats["sender_number"],
        report_count=sender_stats["report_count"],
        frequently_reported=sender_stats["frequently_reported"],
        status="saved",
    )


@app.get("/history")
def history(limit: int = Query(default=20, ge=1, le=100)) -> dict[str, object]:
    return {
        "items": get_history(limit=limit),
        "summary": get_history_summary(),
    }

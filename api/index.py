import os
from datetime import datetime

import pytz
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


SPARKLE_API_URL = os.getenv(
    "SPARKLE_API_URL",
    "https://api.sparkle.io/api/v1/unified/inbox/pending?search=&limit=25&filter=",
)
CRIS_BEARER = os.getenv("CRIS_BEARER", "").strip()
INBOX_EMAIL = os.getenv("INBOX_EMAIL", "Cris@telavbv.com")
TIMEZONE_NAME = os.getenv("TIMEZONE", "Asia/Kolkata")


class ReportResponse(BaseModel):
    status: str
    inbox_email: str
    latest_inbox_read_time: str
    checked_at: str


app = FastAPI(title="Pre-Dev Health API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_latest_inbox_time() -> str:
    if not CRIS_BEARER:
        raise HTTPException(status_code=500, detail="CRIS_BEARER is not configured")

    headers = {"Authorization": CRIS_BEARER, "Content-Type": "application/json"}

    try:
        resp = requests.get(SPARKLE_API_URL, headers=headers, timeout=25)
        resp.raise_for_status()
        payload = resp.json()
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Sparkle API request failed: {exc}")
    except ValueError:
        raise HTTPException(status_code=502, detail="Sparkle API returned non-JSON response")

    items = payload.get("data", {}).get("data", [])
    latest_ts = 0

    for item in items:
        ts = item.get("platform_message_details", {}).get("mail_sent_date")
        if isinstance(ts, (int, float)) and ts > latest_ts:
            latest_ts = ts

    if latest_ts == 0:
        raise HTTPException(status_code=404, detail="No inbox timestamp found in response")

    tz = pytz.timezone(TIMEZONE_NAME)
    dt_local = datetime.fromtimestamp(latest_ts / 1000, tz=pytz.UTC).astimezone(tz)
    return dt_local.strftime("%d %b %Y %I:%M %p")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate-report", response_model=ReportResponse)
def generate_report():
    latest_time = get_latest_inbox_time()
    checked_at = datetime.now(pytz.timezone(TIMEZONE_NAME)).strftime("%d %b %Y %I:%M %p")
    return ReportResponse(
        status="ok",
        inbox_email=INBOX_EMAIL,
        latest_inbox_read_time=latest_time,
        checked_at=checked_at,
    )

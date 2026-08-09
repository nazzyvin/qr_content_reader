from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional

from extractor import extract_from_bytes


class DecodeResult(BaseModel):
    """API response shape for a decode request."""

    success: bool
    content_type: Optional[str] = None
    content: Optional[str] = None
    details: Optional[dict] = None
    actions: Optional[list] = None
    error: Optional[str] = None


app = FastAPI(title="QR Content Extractor")

#Serve static frontend assets
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def index():
    """Serve the frontend page."""
    return FileResponse("static/index.html")


@app.post("/api/decode", response_model=DecodeResult)
async def decode(file: UploadFile = File(...)):
    """
    Decode a QR code from an uploaded image.

    Args:
        file (UploadFile): The uploaded image file.

    Returns:
        DecodeResult: The decoded content, its type, parsed details, and available actions
    """
    image_bytes = await file.read()
    return extract_from_bytes(image_bytes)

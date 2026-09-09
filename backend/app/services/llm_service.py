import os
import json
import logging
import httpx
from ..config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

async def call_gemini_or_fallback(prompt: str, fallback_generator_fn, response_schema: dict = None) -> str:
    """
    Attempts to call Google Gemini API if GEMINI_API_KEY is configured.
    Falls back gracefully to intelligent local generator function if key is missing or request fails.
    """
    api_key = GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
    
    if api_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 1024
                }
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        if text:
                            return text.strip()
        except Exception as e:
            logger.warning(f"Gemini API request failed or timed out: {e}. Falling back to high-quality local generator.")
            
    # Intelligent deterministic fallback
    return fallback_generator_fn()

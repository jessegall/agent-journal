import time
from pathlib import Path

from providers import PROVIDERS


def observe(provider: str, transcript: str, current: dict, now: float | None = None) -> dict | None:
    cls = PROVIDERS.get(provider)
    at = time.time() if now is None else now
    windows = cls().usage(Path(transcript), at) if cls and transcript else None
    if windows is None:
        return {} if current else None
    return {"windows": [window.to_json() for window in windows if window.resets > at]}

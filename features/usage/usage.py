import time
from pathlib import Path

from providers import PROVIDERS


def options(provider: str) -> dict:
    cls = PROVIDERS.get(provider)
    return {"provider": provider, "note": cls.usage_note if cls else "This CLI does not expose plan usage."}


def observe(provider: str, transcript: str, current: dict, now: float | None = None) -> dict | None:
    cls = PROVIDERS.get(provider)
    at = time.time() if now is None else now
    usage = cls().usage(Path(transcript), at) if cls and transcript else None
    if usage is None:
        return {} if current else None
    return {**usage, "windows": [window for window in usage.get("windows", []) if float(window.get("resets") or 0) > at]}

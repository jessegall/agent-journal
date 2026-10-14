import time
from pathlib import Path

from serving import SERVED, Providers


def observe(provider: str, transcript: str, current: dict, now: float | None = None) -> dict | None:
    agent = SERVED.given(Providers).offers(provider)
    at = time.time() if now is None else now
    windows = agent.usage(Path(transcript), at) if agent and transcript else None
    if windows is None:
        return {} if current else None
    return {"windows": [window.to_json() for window in windows if window.resets > at]}

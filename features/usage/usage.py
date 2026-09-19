import json
import time
from pathlib import Path

TAIL_BYTES = 262144
NOTES = {
    "claude": "Claude exposes plan limits only in its native /usage view; the journal does not replace your status-line configuration to scrape them.",
    "codex": "Codex reports plan limits here after its next response.",
}
WINDOW_LABELS = {300: "5h", 1440: "1d", 10080: "7d"}


def options(provider: str) -> dict:
    return {"provider": provider, "note": NOTES.get(provider, "This CLI does not expose plan usage.")}


def tail(path: Path) -> list[str]:
    try:
        with Path(path).open("rb") as source:
            source.seek(0, 2)
            size = source.tell()
            start = max(0, size - TAIL_BYTES)
            source.seek(start)
            raw = source.read()
    except OSError:
        return []
    if start:
        raw = raw.split(b"\n", 1)[-1]
    return raw.decode(errors="replace").splitlines()


def value(row: dict, snake: str, camel: str):
    return row.get(snake) if snake in row else row.get(camel)


def label(minutes: int) -> str:
    if minutes in WINDOW_LABELS:
        return WINDOW_LABELS[minutes]
    if minutes and minutes % 1440 == 0:
        return f"{minutes // 1440}d"
    if minutes and minutes % 60 == 0:
        return f"{minutes // 60}h"
    return f"{minutes}m"


def normalize(limits: dict, now: float) -> dict:
    windows = []
    for key in ("primary", "secondary"):
        raw = limits.get(key)
        if not isinstance(raw, dict):
            continue
        try:
            used = float(value(raw, "used_percent", "usedPercent"))
            minutes = int(value(raw, "window_minutes", "windowDurationMins"))
            resets = int(value(raw, "resets_at", "resetsAt"))
        except (TypeError, ValueError):
            continue
        if resets <= now:
            continue
        windows.append({"key": key, "label": label(minutes), "used": round(used, 1), "minutes": minutes, "resets": resets})
    return {"windows": windows}


def codex(path: Path, now: float | None = None) -> dict | None:
    for line in reversed(tail(path)):
        try:
            row = json.loads(line)
        except ValueError:
            continue
        payload = row.get("payload") or {}
        if row.get("type") != "event_msg" or payload.get("type") != "token_count":
            continue
        limits = payload.get("rate_limits") or payload.get("rateLimits")
        if isinstance(limits, dict):
            return normalize(limits, time.time() if now is None else now)
    return None


def observe(provider: str, transcript: str, current: dict) -> dict | None:
    if provider == "codex":
        return codex(Path(transcript)) if transcript else None
    return {} if current else None

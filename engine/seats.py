import time
from pathlib import Path

from engine.sessions import Sessions
from engine.stored import read_json
from engine import runtime

ONLINE_FOR = 5.0


def live(root: Path) -> list[tuple[dict, dict]]:
    now = time.time()
    sessions = Sessions(root)
    found = {}
    for seat in seats(root, within=ONLINE_FOR):
        report = seat.get("report") or {}
        session = str(report.get("title") or "")
        at = float(seat.get("at") or 0)
        if not session or now - at > ONLINE_FOR:
            continue
        agent = {
            "session": session,
            "provider": report.get("provider") or seat.get("agent") or "",
            "model": report.get("model") or "",
            "status": seat.get("state") or report.get("status") or "",
            "environment": sessions.environment(session) or seat.get("env") or "",
            "at": at,
            "terminal": seat.get("terminal") or "",
        }
        found[session] = (seat, agent)
    return sorted(found.values(), key=lambda pair: (-pair[1]["at"], pair[1]["session"]))


def seats(root: Path, within: float | None = None) -> list[dict]:
    found, now = [], time.time()
    for path in runtime.sessions(root).glob("*/seat.json"):
        try:
            if within is not None and now - path.stat().st_mtime > within:
                continue
        except OSError:
            continue
        seat = read_json(path)
        if seat is not None:
            found.append({**seat, "terminal": path.parent.name})
    return found

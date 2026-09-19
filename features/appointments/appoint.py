import json
import time
from pathlib import Path

from controllers.types import Agents
from engine.actors import STOPPED
from engine.record import Record
from engine.sessions import Sessions
from resources.base import Refused, SYSTEM

ONLINE_FOR = 5.0


def online(root: Path) -> list[dict]:
    return [agent for _, agent in live(root)]


def live(root: Path) -> list[tuple[dict, dict]]:
    now = time.time()
    sessions = Sessions(root)
    found = {}
    for seat in seats(root):
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
        }
        found[session] = (seat, agent)
    return sorted(found.values(), key=lambda pair: (-pair[1]["at"], pair[1]["session"]))


def appoint(root: Path, env: str, session: str) -> dict:
    root = Path(root)
    environments = root / "environments"
    names = {path.name for path in environments.iterdir() if path.is_dir()} if environments.is_dir() else set()
    if env not in names:
        raise Refused(f"no environment {env!r}")
    found = next((pair for pair in live(root) if pair[1]["session"] == session), None)
    if not found:
        raise Refused(f"session {session!r} is not online")
    seat, candidate = found
    sessions = Sessions(root)
    holder = sessions.holder(env)
    if holder and holder != session:
        raise Refused(f"environment {env!r} is taken by session {holder}")
    before = sessions.environment(session)
    sessions.write(session, environment=env, before=before if before != env else sessions.read(session).get("before", ""), since=time.time())
    if before in names and before != env:
        previous = Agents(Record(root, before), actor=SYSTEM)
        row = next((agent for agent in previous.all() if agent.title == session), None)
        if row:
            previous.update(row.n, status=STOPPED, at=time.time())
    report = seat.get("report") or {}
    agents = Agents(Record(root, env), actor=SYSTEM)
    row = agents.by_session(session)
    state = {**report, "status": seat.get("state") or report.get("status") or "", "at": time.time()}
    state.pop("title", None)
    agents.update(row.n, **state)
    return {**candidate, "before": before, "environment": env}


def seats(root: Path) -> list[dict]:
    found = []
    for path in (Path(root) / "runtime").glob("seat-*.json"):
        try:
            found.append(json.loads(path.read_text()))
        except (OSError, ValueError):
            pass
    return found

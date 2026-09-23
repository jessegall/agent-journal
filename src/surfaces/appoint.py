import time
from pathlib import Path

from controllers.types import Agents, Environments
from engine.actors import STOPPED
from engine.record import Record
from engine.seats import live
from engine.sessions import Sessions
from resources.base import Refused, SYSTEM


def online(root: Path) -> list[dict]:
    return [agent.to_json() for _, agent in live(root)]


def appoint(root: Path, env: str, session: str) -> dict:
    root = Path(root)
    found = next((pair for pair in live(root) if pair[1].session == session), None)
    if not found:
        raise Refused(f"session {session!r} is not online")
    seat, candidate = found
    before = Sessions(root).environment(session)
    environments = Environments(Record(root, before or env), actor=SYSTEM, session=session)
    target = environments._titled(env)
    if not target:
        raise Refused(f"no environment {env!r}")
    environments.switch(target.n, move=session)
    if before and before != env:
        previous = Agents(Record(root, before), actor=SYSTEM)
        row = previous._titled(session)
        if row:
            previous.update(row.n, status=STOPPED, at=time.time())
    agents = Agents(Record(root, env), actor=SYSTEM)
    row = agents.by_session(session)
    state = {**seat.report, "status": seat.status, "at": time.time()}
    state.pop("title", None)
    agents.update(row.n, **state)
    return {**candidate.to_json(), "before": before, "environment": env}

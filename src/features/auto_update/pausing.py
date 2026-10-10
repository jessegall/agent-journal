import time
from dataclasses import asdict, dataclass
from pathlib import Path

from controllers.agents import Agents
from engine import runtime
from engine.inputs import PAUSE, RESUME, UPDATE, queue, withdraw
from engine.record import Record
from resources.base import SYSTEM
from engine.seats import live
from engine.sessions import Sessions
from engine.stored import read_json, write_json
from engine.wording import plural
from features.auto_update.waiting import ancestors

KEPT = "paused-for-update.json"
STALE_PAUSE = 600.0


@dataclass(frozen=True)
class Paused:
    session: str
    provider: str


def kept(root: Path) -> Path:
    return runtime.folder(root) / KEPT


def paused(root: Path) -> list[Paused]:
    return [Paused(**held) for held in read_json(kept(root), list, []) if isinstance(held, dict)]


def pause_all(root: Path) -> list[str]:
    """Pauses every live agent in every environment for the update, but the agent whose own command runs it, and says which."""
    mine, sessions = ancestors(), Sessions(root)
    stopped = [Paused(agent.session, agent.provider) for _, agent in live(root) if sessions.read(agent.session).pid not in mine]
    for one in stopped:
        queue(root, one.session, (), "Pause", provider=one.provider, action=PAUSE, value=UPDATE)
    write_json(kept(root), [asdict(one) for one in stopped])
    if not stopped:
        return []
    return [f"paused {plural(len(stopped), 'agent')} for the update"]


def still_paused(root: Path) -> list[Paused]:
    """The live agents of every environment whose own row says the update holds them; a row paused for longer than any update takes is a leftover, and the engine ends its pause on its own."""
    held = []
    for _, agent in live(root):
        rows = Agents(Record(root, agent.environment), actor=SYSTEM).rows.standing()
        if any(row.paused and row.paused_for == UPDATE and time.time() - float(row.paused) < STALE_PAUSE for row in rows):
            held.append(Paused(agent.session, agent.provider))
    return held


def resume_all(root: Path) -> int:
    """Resumes every agent the update paused, tickets and helpers of every environment among them, each told so; the ones whose row still says paused are asked again until the line is submitted."""
    waiting = {one.session: one for one in [*paused(root), *still_paused(root)]}
    for one in waiting.values():
        withdraw(root, one.session, PAUSE, UPDATE)
        withdraw(root, one.session, RESUME, UPDATE)
        queue(root, one.session, (), "Resume", provider=one.provider, action=RESUME, value=UPDATE)
    stayed = still_paused(root)
    write_json(kept(root), [asdict(one) for one in stayed]) if stayed else kept(root).unlink(missing_ok=True)
    return len(waiting)


def resume_when_done(root: Path) -> int:
    """The agents paused for an update are resumed once no upgrade holds its mark, by the server that is up then."""
    return 0 if runtime.upgrading(root) or not kept(root).is_file() else resume_all(root)

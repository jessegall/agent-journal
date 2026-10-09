from dataclasses import asdict, dataclass
from pathlib import Path

from engine import runtime
from engine.inputs import PAUSE, RESUME, UPDATE, queue
from engine.seats import live
from engine.sessions import Sessions
from engine.stored import read_json, write_json
from engine.wording import plural
from features.auto_update.waiting import ancestors

KEPT = "paused-for-update.json"


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


def resume_all(root: Path) -> int:
    """Resumes the agents paused for an update, each told so, once."""
    waiting = paused(root)
    kept(root).unlink(missing_ok=True)
    for one in waiting:
        queue(root, one.session, (), "Resume", provider=one.provider, action=RESUME, value=UPDATE)
    return len(waiting)


def resume_when_done(root: Path) -> int:
    """The agents paused for an update are resumed once no upgrade holds its mark, by the server that is up then."""
    return 0 if runtime.upgrading(root) or not kept(root).is_file() else resume_all(root)

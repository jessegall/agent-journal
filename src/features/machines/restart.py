from enum import StrEnum

from agents.terminal import Launched
from controllers.types import Agents
from engine.seats import terminal_of
from engine.sessions import Sessions, alive
from resources.base import SYSTEM
from resources.types import STOPPED


class Fate(StrEnum):
    PICKED_UP = "picked up"
    LOST = "lost"


def gone(root, name: str, session) -> bool:
    """Whether a session's process and the one the journal launched for it both ended."""
    launched = Launched.read(root, terminal_of(root, name) or name)
    return bool(session.pid) and not alive(session.pid) and not (launched.pid and alive(launched.pid))


def after_restart(record) -> dict[str, Fate]:
    """Settles each agent of an environment once the server has started again: one whose process still runs is picked up where it was, and one whose process is gone is shown as stopped, with a mark in the chat saying it was lost."""
    root, agents = record.root, Agents(record, actor=SYSTEM)
    fates = {}
    for name, session in Sessions(root).all().items():
        row = agents.rows.by_title(name)
        if session.environment != record.env or row is None:
            continue
        fates[name] = Fate.LOST if gone(root, name, session) else Fate.PICKED_UP
        if fates[name] is Fate.LOST and row.status != STOPPED:
            agents.update(row.n, status=STOPPED)
            agents.card(row.n, key=f"lost:{name}", label="Agent lost in the restart", icon="warn", tone="danger", title=f"{name} was running before the server restarted and is gone")
    return fates

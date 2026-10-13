from enum import StrEnum

from controllers.types import Agents
from resources.base import SYSTEM
from resources.types import STOPPED


class Fate(StrEnum):
    PICKED_UP = "picked up"
    LOST = "lost"


def gone(root, name: str, session, processes) -> bool:
    """Whether a session's process and the one the journal launched for it both ended."""
    launched = processes.launched_pid(root, name)
    return bool(session.pid) and not processes.alive(session.pid) and not (launched and processes.alive(launched))


def after_restart(record, sessions, processes) -> dict[str, Fate]:
    """Settles each agent of an environment once the server has started again: one whose process still runs is picked up where it was, and one whose process is gone is shown as stopped, with a mark in the chat saying it was lost."""
    root, agents = record.root, Agents(record, actor=SYSTEM)
    fates = {}
    for name, session in sessions.all().items():
        row = agents.rows.by_title(name)
        if session.environment != record.env or row is None:
            continue
        fates[name] = Fate.LOST if gone(root, name, session, processes) else Fate.PICKED_UP
        if fates[name] is Fate.LOST and row.status != STOPPED:
            agents.update(row.n, status=STOPPED)
            agents.card(row.n, key=f"lost:{name}", label="Agent lost in the restart", icon="warn", tone="danger", title=f"{name} was running before the server restarted and is gone")
    return fates

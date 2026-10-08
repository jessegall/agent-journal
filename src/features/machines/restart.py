from enum import StrEnum

from controllers.types import Agents
from engine.sessions import Sessions
from features.helpers.handlers import gone
from resources.base import SYSTEM
from resources.types import STOPPED


class Fate(StrEnum):
    PICKED_UP = "picked up"
    LOST = "lost"


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

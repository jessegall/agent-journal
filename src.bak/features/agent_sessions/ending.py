from pathlib import Path

from controllers.types import Agents, environment_records
from framework.seating import sessions_of, still_live
from resources.base import SYSTEM
from resources.types import STOPPED


def has_ended(row, sessions, agents) -> bool:
    """Whether a row still counted as running belongs to a session that is gone, and is not being taken over by a newer process of the same conversation."""
    return row.live and not still_live(sessions.read(row.title)) and not relaunching(row, sessions, agents)


def relaunching(row, sessions, agents) -> bool:
    """A conversation started again in a new process keeps its old session record, with the dead process in it, until the first hook of the new process takes it over; until then the newer live process of the same provider in its environment, which has no row of its own yet, is its successor, and the row is not ended."""
    held = sessions.read(row.title)
    reported = {sessions.read(other.title).pid for other in agents.rows.every() if other.event and other.n != row.n}
    return any(name != row.title and other.environment == held.environment and other.provider == held.provider and other.since > float(row.at) and still_live(other)
               and other.pid not in reported for name, other in sessions.all().items())


def stop(agents, row) -> None:
    """A session that ended is stopped, with the command it left running and the stop it was asked for dropped, so no later session hears of them."""
    agents.stamp(row.n, status=STOPPED, running={}, stopping={})


def stop_ended(root: Path) -> str:
    """Stops the agent rows of every session that ended before this upgrade."""
    ended = []
    for record in environment_records(Path(root)):
        agents, sessions = Agents(record, actor=SYSTEM), sessions_of(record)
        for row in agents.rows.every():
            if not has_ended(row, sessions, agents):
                continue
            stop(agents, row)
            ended.append(row.title)
    return f"sessions that had ended are stopped: {', '.join(ended)}" if ended else "no ended session was left running"

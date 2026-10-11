from controllers.types import Agents, Works
from engine.command_runs import command_runs
from features.helpers.controller import Helpers
from features.helpers.reuse import subagent_rows
from resources.base import SYSTEM


def edits_in(row, since: float) -> int:
    """How many files an agent edited or created in the runs its row still keeps from this moment on."""
    return sum(run.changed.edited + run.changed.created for run in command_runs(row) if run.at >= since and run.changed)


def stretch(record, primary) -> float:
    """The moment the stretch is counted from: when the work in hand began, or the oldest run the main agent still
    keeps, whichever is later, so no one is measured over a longer past than the main agent remembers."""
    started = [float(work.created) for work in Works(record, actor=SYSTEM).rows.standing() if not work.parked]
    kept = [run.at for run in command_runs(primary)[:1]]
    return max([*started, *kept, 0.0])


def others(record, agents, primary) -> list:
    """The agent rows of this environment's subagents and of its helpers, each read in its own environment."""
    rows = [agents.rows.by_title(sub.session) for sub in subagent_rows(primary) if sub.session]
    for helper in Helpers(record, actor=SYSTEM).rows.standing():
        rows.append(Agents(record.sibling(helper.environment), actor=SYSTEM).primary_to_read())
    return [row for row in rows if row]


def share(record) -> tuple[int, int]:
    """The edits the main agent made itself and those its helpers and subagents made, over the one stretch."""
    agents = Agents(record, actor=SYSTEM)
    primary = agents.primary_to_read()
    if not primary:
        return 0, 0
    since = stretch(record, primary)
    return edits_in(primary, since), sum(edits_in(row, since) for row in others(record, agents, primary))

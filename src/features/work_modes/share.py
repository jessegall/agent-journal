from resources.command_runs import command_runs
from resources.reuse import subagent_rows
from resources.types import AgentRow, Helper, Work
from serving import ReadElsewhere, ReadRows


def edits_in(row, since: float) -> int:
    """How many files an agent edited or created in the runs its row still keeps from this moment on."""
    return sum(run.changed.edited + run.changed.created for run in command_runs(row) if run.at >= since and run.changed)


def stretch(works: ReadRows[Work], primary) -> float:
    """The moment the stretch is counted from: when the work in hand began, or the oldest run the main agent still
    keeps, whichever is later, so no one is measured over a longer past than the main agent remembers."""
    started = [float(work.created) for work in works.rows.standing() if not work.parked]
    kept = [run.at for run in command_runs(primary)[:1]]
    return max([*started, *kept, 0.0])


def others(agents: ReadRows[AgentRow], helpers: ReadRows[Helper], elsewhere: ReadElsewhere, primary) -> list:
    """The agent rows of this environment's subagents and of its helpers, each read in its own environment."""
    rows = [agents.rows.by_title(sub.session) for sub in subagent_rows(primary) if sub.session]
    for helper in helpers.rows.standing():
        rows.append(elsewhere.named(helper.environment).rows(AgentRow).primary_to_read())
    return [row for row in rows if row]


def share(agents: ReadRows[AgentRow], works: ReadRows[Work], helpers: ReadRows[Helper], elsewhere: ReadElsewhere) -> tuple[int, int]:
    """The edits the main agent made itself and those its helpers and subagents made, over the one stretch."""
    primary = agents.primary_to_read()
    if not primary:
        return 0, 0
    since = stretch(works, primary)
    return edits_in(primary, since), sum(edits_in(row, since) for row in others(agents, helpers, elsewhere, primary))

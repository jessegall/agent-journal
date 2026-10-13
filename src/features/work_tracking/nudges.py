import time
from pathlib import Path

from declaring.trigger import MINUTE
from framework.work_mode import taking
from features.work_tracking.auto import automatic
from features.work_tracking.details import CHECK_IN
from features.work_tracking.next import carried_on, helping, in_sight, named_rows, ready, waiting_rows
from controllers.types import Messages, Works
from framework.parts import Context
from framework.sending import Sent
from resources.base import SYSTEM, USER
from serving import SERVED, Providers

FIRST_AFTER = 5


def working(context: Context) -> list:
    return [w for w in context.journal.get(Works).rows.standing() if not w.parked]


def next_row(standing: bool):
    def about(context, agent) -> list[Sent]:
        open_work = working(context)
        if bool(open_work) != standing or (open_work and open_work[0].awaiting):
            return []
        return [Sent(f"{row.n}:{row.updated}", {"n": row.n, "work": open_work[0].n, "rows": [row.ref, open_work[0].ref]} if standing else
                     {"n": row.n, "taking": taking(context.record), "rows": [row.ref]}) for row in ready(context.record)[:1]]
    return about


def next_while_helping(context, agent) -> list[Sent]:
    """A main agent whose work waits on a helper or subagent is offered the next ready row at once, to work while it waits."""
    open_work = working(context)
    if not open_work or not open_work[0].awaiting:
        return []
    rows = ready(context.record)
    busy = helping(context.record) if rows else []
    if not busy:
        return []
    row, work = rows[0], open_work[0]
    return [Sent(f"{row.n}:{row.updated}", {"n": row.n, "work": work.n, "who": busy[0].name, "rows": [row.ref, work.ref]})]


def stopped_with_work(context, agent) -> list[Sent]:
    if agent.idle_for < FIRST_AFTER * MINUTE:
        return []
    return [Sent(f"{work.n}:{work.updated}", {"n": work.n, "title": work.title, "rows": [work.ref]}) for work in carried_on(context.record)[:1]]


def last_heard_from_the_user(context, agent) -> float:
    """When the person last spoke to this agent: a message they wrote in the viewer or a prompt they typed themselves, never a line the journal typed."""
    written = [row.created for row in Messages(context.record, actor=SYSTEM).rows.summaries() if row.seen[:1] == [USER] and not row.deleted]
    return max([float(agent.person_at), *written])


def nothing_left(context) -> bool:
    """Whether this environment holds nothing to carry on with: no work open, no ready row and no row waiting on anything."""
    return not working(context) and not ready(context.record) and not waiting_rows(context.record)


def stopped_in_auto(context, agent) -> list[Sent]:
    """With auto mode on, an agent that stopped long after the person last spoke is told to carry on at each stop, or once per word from the person while no row is ready, unless the person stopped it themselves or the environment holds nothing to carry on with."""
    after = context.settings.carry_on_after * MINUTE
    if not automatic(context.record) or agent.subagent or agent.paused or agent.idle_for < FIRST_AFTER * MINUTE or time.time() - last_heard_from_the_user(context, agent) < after:
        return []
    if nothing_left(context):
        return []
    provider = SERVED.given(Providers).offers(agent.provider)
    if provider is not None and agent.transcript and provider.interrupted_by_user(Path(agent.transcript)):
        return []
    stop = f"{agent.at}" if ready(context.record) else f"held|{last_heard_from_the_user(context, agent)}"
    return [Sent(stop, {"minutes": int(after // MINUTE)})]


def check_in_pace(context) -> int:
    return context.settings.check_in_every


def nothing_happening(context, agent) -> list[Sent]:
    """The fallback: nothing has happened for the check-in interval, so the agent is asked whether anything is left, whatever this environment holds. Every other nudge here returns early on some state - no work open, no ready row, nothing blocked - which together leave a stuck agent told nothing at all."""
    if agent.subagent or agent.paused or agent.idle_for < check_in_pace(context) * MINUTE:
        return []
    return [Sent(CHECK_IN, {"minutes": int(agent.idle_for // MINUTE), "seen": in_sight(context.record)})]


def nothing_ready(context, agent) -> list[Sent]:
    if agent.idle_for < FIRST_AFTER * MINUTE or working(context) or ready(context.record):
        return []
    held = waiting_rows(context.record)
    return [Sent(",".join(str(t.n) for t in held), {"rows": named_rows(held)})] if held else []

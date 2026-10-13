import time

from controllers.types import Plans, Works
from declaring.trigger import MINUTE
from features.work_tracking.next import carried_on, free, named_rows, ready, waiting_rows
from framework.sending import Nudge, Sent
from resources.base import SYSTEM
from resources.plans import PHASE

STILL_TIMES = 3


def still_plans(context, agent) -> list[Sent]:
    quiet = agent.idle_for
    if quiet < float(context.feature.cadence(context.record, "still").every) * MINUTE or carried_on(context.record):
        return []
    found = [(plan, doable(context.record, plan)) for plan in Plans(context.record, actor=SYSTEM).active()]
    return [Sent(f"{plan.n}:{plan.updated}", {"n": plan.n, "title": plan.title, "minutes": int(quiet // MINUTE), "rows": rows}) for plan, rows in found if rows]


def doable(record, plan) -> str:
    phase = plan.current_phase
    if phase is None:
        return ""
    mine = set(phase[PHASE.todos])
    going = [f"to-do {w.todo}" for w in Works(record, actor=SYSTEM).rows.standing() if int(w.todo) in mine and not w.parked and not w.awaiting]
    taking = [f"to-do {t.n}" for t in ready(record) if t.n in mine]
    parts = []
    if going:
        parts.append(f"go on with {', '.join(going)}")
    if taking:
        parts.append(f"take {', '.join(taking)}")
    return ", then ".join(parts)


def blocked_plans(context, agent) -> list[Sent]:
    found = []
    for plan in Plans(context.record, actor=SYSTEM).active():
        held = waiting_rows(context.record, {n for phase in plan.phases for n in phase[PHASE.todos]})
        if held:
            found.append(Sent(str(plan.n), {"n": plan.n, "title": plan.title, "rows": named_rows(held)}))
    return found


def standing_still(context, agent) -> list[Sent]:
    """A running plan whose current phase has open rows that nothing holds, in a while, and no work in hand on them: the plan stands still and nobody has stopped it, the shape of rows built and left open."""
    quiet = time.time() - float(context.feature.cadence(context.record, "still").every) * MINUTE
    plans, taken = Plans(context.record, actor=SYSTEM), {int(w.todo) for w in carried_on(context.record)}
    found = []
    for plan in plans.active():
        phase = plan.current_phase
        rows = [row for row in plans.members(phase) if not row.completed] if phase else []
        if rows and all(row.type == "todo" and free(context.record, row) and row.n not in taken and row.updated < quiet for row in rows):
            found.append(Sent(f"{plan.n}:{plan.current}", {"n": plan.n, "title": plan.title, "phase": phase[PHASE.title],
                                                           "rows": ", ".join(str(row.n) for row in rows), "minutes": int((time.time() - max(row.updated for row in rows)) // MINUTE)}))
    return found


STANDING_STILL = Nudge("standing still", behaviour="still", about=standing_still, most=STILL_TIMES,
                       guarantee="When a running plan's current phase has open rows that nothing blocks and nobody has touched, the agent is told to close them or say what they wait on.")

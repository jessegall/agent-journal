from dataclasses import dataclass
from typing import ClassVar

from controllers.types import Todos, Works
from engine.events.engine import ClockTicked
from engine.events.resources import AnyEvent, ResourceEvent, TodoCompleted
from features.plans.controller import ABANDONED, ACTIVE, APPROVED, BUILDING, DEPTHS, DRAFT, PARKED, PHASES, READY, REVIEWING, RUNNING, WAITING, Plans
from features.nudges import Sent
from features.trigger import MINUTE
from features.plans.resource import PHASE, PHASE_FIELDS
from features.work_tracking.auto import passes_checkpoints
from features.work_tracking.next import carried_on, named_rows, ready, waiting_rows
from features.parts import AgentContext, Context, Handler
from resources.base import AGENT, SYSTEM, USER
from features.plans.controller import Plans

ADVANCES = {("todo", "completed"), ("ticket", "completed"), ("plan", "updated"), ("agent", "reported")}


@dataclass(frozen=True)
class PlanChanged(ResourceEvent):
    on: ClassVar[str] = "plan"
    status: str = ""
    parked_for: int = 0


class StartBuilding(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        speaking = context.to_primary()
        if event.action == "created" and event.actor == USER and speaking:
            plan = context.journal.get(Plans).load(event.n)
            speaking.agent.say("started", n=plan.n, title=plan.title, depth=DEPTHS[plan.depth])


class StartApproved(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        speaking = context.to_primary()
        if event.action != "updated" or event.actor not in (USER, SYSTEM) or not speaking:
            return
        plan = context.journal.get(Plans).load(event.n)
        if plan.status == APPROVED and speaking.once("approved", str(plan.n)):
            speaking.agent.say("approved", n=plan.n, title=plan.title)


class TellParkedAndPickedUp(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        speaking = context.to_primary()
        if event.action != "updated" or event.actor != USER or event.status not in (ACTIVE, PARKED) or event.parked_for or not speaking:
            return
        plan = context.journal.get(Plans).load(event.n)
        line = "picked up" if event.status == ACTIVE else "parked"
        speaking.agent.say(line, n=plan.n, title=plan.title, phase=plan.current)


class GuideBuilding(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        if not (event.written or event.action == "linked") or event.actor != AGENT:
            return
        plan = context.journal.get(Plans).load(event.n)
        speaking = context.to_primary()
        if plan.status != BUILDING or not speaking:
            return
        stage = plan.stage or PHASES
        filled = bool(plan.phases) and not plan.empty_phases()
        line = "ready" if stage != PHASES and filled else stage
        if speaking.once("planned", f"{plan.n}:{line}"):
            speaking.agent.say(line, n=plan.n)


class PassCheckpointsInAuto(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        if not passes_checkpoints(context.record):
            return
        plans = context.journal.get(Plans)
        for plan in plans.rows.every():
            if plan.status == WAITING:
                plans.resume(plan.n)


class TakeStruckRowsOutOfUnapprovedPlans(Handler):
    def handle(self, context: Context, event: TodoCompleted) -> None:
        if not context.journal.get(Todos).load(event.n).data.get("struck"):
            return
        plans = context.journal.get(Plans)
        for plan in plans.rows.every():
            p = plan.phase_of("todo", event.n)
            if p and plan.status in (BUILDING, DRAFT, READY, REVIEWING):
                plans.place(plan.n, p, [event.n], off=True)


class AdvancePlans(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if (event.type, event.action) in ADVANCES:
            Plans(context.record, actor=SYSTEM)._catch_up()


@dataclass(frozen=True)
class RowReopened(ResourceEvent):
    on: ClassVar[str] = "reopened"


class ReopenPlansWithTheirRows(Handler):
    def handle(self, context: Context, event: RowReopened) -> None:
        if event.type not in PHASE_FIELDS:
            return
        plans = Plans(context.record, actor=SYSTEM)
        for plan in plans.rows.every():
            found = plan.phase_of(event.type, event.n)
            if not found or plan.status == ABANDONED or (plan.status in RUNNING and plan.current <= found):
                continue
            plan = plans.reopen(plan.n, why=f"{event.type} {event.n} of phase {found} was reopened") if plan.completed else plans.load(plan.n)
            plan.status, plan.current = ACTIVE, found
            plans.save(plan, "updated", phase=found, status=ACTIVE)


def still_plans(context, agent) -> list[Sent]:
    quiet = agent.idle_for
    if quiet < float(context.feature.cadence(context.record, "still").every) * MINUTE or carried_on(context.record):
        return []
    found = [(plan, doable(context.record, plan)) for plan in Plans(context.record, actor=SYSTEM)._active()]
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
    for plan in Plans(context.record, actor=SYSTEM)._active():
        held = waiting_rows(context.record, {n for phase in plan.phases for n in phase[PHASE.todos]})
        if held:
            found.append(Sent(str(plan.n), {"n": plan.n, "title": plan.title, "rows": named_rows(held)}))
    return found


@dataclass(frozen=True)
class ReportLinked(ResourceEvent):
    on: ClassVar[str] = "report.linked"
    to: str = ""


class EndReviewWithItsReport(Handler):
    def handle(self, context: Context, event: ReportLinked) -> None:
        plans = context.journal.acting(SYSTEM).get(Plans)
        plan = plans._under_review(event.to)
        if not plan:
            return
        plans.build(plan.n)
        speaking = context.to_primary()
        if speaking:
            speaking.agent.say("reviewed", n=plan.n, title=plan.title, report=event.n)

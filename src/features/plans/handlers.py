import time
from dataclasses import dataclass
from typing import ClassVar

from controllers.types import Todos, Works
from engine.events.agents import AgentReported
from engine.events.engine import ClockTicked
from engine.events.resources import AnyEvent, ResourceEvent
from features.plans.controller import ABANDONED, ACTIVE, APPROVED, BUILDING, DEPTHS, DRAFT, PARKED, PHASES, READY, RUNNING, WAITING, Plans
from features.plans.details import PlansDetails
from features.plans.progress import catch_up, current_phase
from features.plans.resource import PHASE, rows_of
from features.work_tracking.auto import passes_checkpoints
from features.work_tracking.next import ready
from features.parts import AgentContext, Context, Handler
from resources.base import AGENT, SYSTEM, USER
from resources.types import IDLE

BLOCKED_ASKED = "plans.blocked_asked"
ADVANCES = {("todo", "completed"), ("ticket", "completed"), ("plan", "updated"), ("agent", "reported")}


@dataclass(frozen=True)
class PlanChanged(ResourceEvent):
    on: ClassVar[str] = "plan"
    status: str = ""
    parked_for: int = 0


class StartBuilding(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        agent = context.journal.agents.primary()
        if event.action == "created" and event.actor == USER and agent:
            plan = context.journal.plans.load(event.n)
            context.speaking_to(agent).agent.say("started", n=plan.n, title=plan.title, depth=DEPTHS[plan.depth])


class StartApproved(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        agent = context.journal.agents.primary()
        if event.action != "updated" or event.actor not in (USER, SYSTEM) or not agent:
            return
        plan = context.journal.plans.load(event.n)
        speaking = context.speaking_to(agent)
        if plan.status == APPROVED and speaking.once("approved", str(plan.n)):
            speaking.agent.say("approved", n=plan.n, title=plan.title)


class TellParkedAndPickedUp(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        agent = context.journal.agents.primary()
        if event.action != "updated" or event.actor != USER or event.status not in (ACTIVE, PARKED) or event.parked_for or not agent:
            return
        plan = context.journal.plans.load(event.n)
        line = "picked up" if event.status == ACTIVE else "parked"
        context.speaking_to(agent).agent.say(line, n=plan.n, title=plan.title, phase=plan.current)


class GuideBuilding(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        if not (event.written or event.action == "linked") or event.actor != AGENT:
            return
        plan = context.journal.plans.load(event.n)
        agent = context.journal.agents.primary()
        if plan.status != BUILDING or not agent:
            return
        stage = plan.stage or PHASES
        filled = bool(plan.phases) and all(rows_of(p) for p in plan.phases)
        line = "ready" if stage != PHASES and filled else stage
        speaking = context.speaking_to(agent)
        if speaking.once("planned", f"{plan.n}:{line}"):
            speaking.agent.say(line, n=plan.n)


class PassCheckpointsInAuto(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if not passes_checkpoints(context.record):
            return
        plans = context.journal.plans
        for plan in plans._every():
            if plan.status == WAITING:
                plans.resume(plan.n)


class TakeStruckRowsOutOfUnapprovedPlans(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if (event.type, event.action) != ("todo", "completed") or not context.journal.todos.load(event.n).data.get("struck"):
            return
        plans = context.journal.plans
        for plan in plans._every():
            if plan.status not in (BUILDING, DRAFT, READY):
                continue
            for p, phase in enumerate(plan.phases, 1):
                if event.n in phase[PHASE.todos]:
                    plans.place(plan.n, p, [event.n], off=True)


class AdvancePlans(Handler):
    def handle(self, context: Context, event: AnyEvent) -> None:
        if (event.type, event.action) in ADVANCES:
            catch_up(context.record)


@dataclass(frozen=True)
class RowReopened(ResourceEvent):
    on: ClassVar[str] = "reopened"


class ReopenPlansWithTheirRows(Handler):
    def handle(self, context: Context, event: RowReopened) -> None:
        field = {"todo": PHASE.todos, "ticket": PHASE.tickets}.get(event.type)
        if not field:
            return
        plans = Plans(context.record, actor=SYSTEM)
        for plan in plans._every():
            found = next((p for p, phase in enumerate(plan.phases, 1) if event.n in phase.get(field, [])), 0)
            if not found or plan.status == ABANDONED or (plan.status in RUNNING and plan.current <= found):
                continue
            if plan.completed:
                plan = plans.reopen(plan.n, why=f"{event.type} {event.n} of phase {found} was reopened")
            plan.status, plan.current = ACTIVE, found
            plans.save(plan, "updated", phase=found, status=ACTIVE)


class NudgeAStillPlan(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        agent = context.journal.agents.primary()
        if not agent or agent.status != IDLE:
            return
        still = float(PlansDetails.values(context.record).still_minutes) * 60
        quiet = time.time() - float(agent.at)
        if quiet < still:
            return
        speaking = context.speaking_to(agent)
        for plan in Plans(context.record, actor=SYSTEM)._every():
            if plan.status != ACTIVE:
                continue
            rows = doable(context.record, plan)
            if rows and speaking.once("still", f"{plan.n}:{int(float(agent.at))}:{int(quiet // still)}"):
                speaking.agent.whisper("still", n=plan.n, title=plan.title, minutes=int(quiet // 60), rows=rows)


def doable(record, plan) -> str:
    phase = current_phase(plan)
    if phase is None:
        return ""
    mine = set(phase[PHASE.todos])
    going = [f"to-do {w.todo}" for w in Works(record, actor=SYSTEM)._standing() if int(w.todo) in mine and not w.parked and not w.awaiting]
    taking = [f"to-do {t.n}" for t in ready(record) if t.n in mine]
    parts = []
    if going:
        parts.append(f"go on with {', '.join(going)}")
    if taking:
        parts.append(f"take {', '.join(taking)}")
    return ", then ".join(parts)


class AskAboutBlockedRows(Handler):
    def handle(self, context: AgentContext, event: ClockTicked) -> None:
        ask_about_blocked_rows(context)


class AskAboutBlockedRowsOnToolUse(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        ask_about_blocked_rows(context)


def ask_about_blocked_rows(context) -> None:
    agent = context.journal.agents.primary()
    if not agent:
        return
    every, now = float(PlansDetails.values(context.record).blocked_minutes) * 60, time.time()
    state = context.record.state(BLOCKED_ASKED)
    todos = Todos(context.record, actor=SYSTEM)
    for plan in Plans(context.record, actor=SYSTEM)._every():
        if plan.status != ACTIVE or now - float(state.get(str(plan.n), 0)) < every:
            continue
        mine = {n for phase in plan.phases for n in phase[PHASE.todos]}
        held = [t for t in todos._standing() if t.n in mine and (t.blocked or todos.waits(t))]
        if held:
            state.set(str(plan.n), now)
            context.speaking_to(agent).agent.whisper("blocked", n=plan.n, title=plan.title, rows="; ".join(f"to-do {t.n}, {t.title}" for t in held))

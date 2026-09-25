from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentReported, AnyEvent, ResourceEvent
from features.plans.controller import ACTIVE, APPROVED, BUILDING, DEPTHS, DRAFT, PARKED, PHASES, READY, WAITING
from features.plans.progress import catch_up
from features.plans.resource import PHASE, rows_of
from features.work_tracking.auto import passes_checkpoints
from features.parts import AgentContext, Context, Handler
from resources.base import AGENT, SYSTEM, USER

WRITTEN = ("created", "updated", "linked")
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
        if event.action not in WRITTEN or event.actor != AGENT:
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

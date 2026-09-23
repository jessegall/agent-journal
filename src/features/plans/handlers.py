from dataclasses import dataclass
from typing import ClassVar

from engine.events import AgentReported, AnyEvent, ResourceEvent
from features.plans.controller import APPROVED, BUILDING, DEPTHS, DRAFT, PHASES, READY, WAITING
from features.plans.progress import catch_up
from features.plans.resource import PHASE
from features.work_tracking.auto import automatic
from features.parts import AgentContext, Context, Handler
from resources.base import AGENT, USER

WRITTEN = ("created", "updated", "linked")
ADVANCES = {("todo", "completed"), ("plan", "updated"), ("agent", "reported")}


@dataclass(frozen=True)
class PlanChanged(ResourceEvent):
    on: ClassVar[str] = "plan"


class StartBuilding(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        agent = context.journal.agents.primary()
        if event.action == "created" and event.actor == USER and agent:
            plan = context.journal.plans.load(event.n)
            context.speaking_to(agent).agent.say("started", n=plan.n, title=plan.title, depth=DEPTHS[plan.depth])


class StartApproved(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        agent = context.journal.agents.primary()
        if event.action != "updated" or event.actor != USER or not agent:
            return
        plan = context.journal.plans.load(event.n)
        speaking = context.speaking_to(agent)
        if plan.status == APPROVED and speaking.once("approved", str(plan.n)):
            speaking.agent.say("approved", n=plan.n, title=plan.title)


class GuideBuilding(Handler):
    def handle(self, context: Context, event: PlanChanged) -> None:
        if event.action not in WRITTEN or event.actor != AGENT:
            return
        plan = context.journal.plans.load(event.n)
        agent = context.journal.agents.primary()
        if plan.status != BUILDING or not agent:
            return
        stage = plan.stage or PHASES
        filled = bool(plan.phases) and all(p[PHASE.todos] for p in plan.phases)
        line = "ready" if stage != PHASES and filled else stage
        speaking = context.speaking_to(agent)
        if speaking.once("planned", f"{plan.n}:{line}"):
            speaking.agent.say(line, n=plan.n)


class PassCheckpointsInAuto(Handler):
    def handle(self, context: AgentContext, event: AgentReported) -> None:
        if not automatic(context.record):
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

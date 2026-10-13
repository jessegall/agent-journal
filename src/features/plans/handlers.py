from events import Fact
from events.plans import (CheckpointPassed, PlanApproved, PlanBuildBegun, PlanBuildingGuided, PlanHandedToHelper, PlanMovedByUser, PlanRowReopened, PlansToAdvance,
                          ReviewEndedWithReport, ReviewReportLinked, StruckRowInUnapprovedPlan)
from receiving import Handler
from resources.plans import ACTIVE
from resources.types import Plan
from serving import Chat, Rows


class StartBuilding(Handler[PlanBuildBegun]):
    def handle(self, event: PlanBuildBegun, chat: Chat) -> list[Fact]:
        chat.say("started", n=event.plan, title=event.title, depth=event.depth)
        return []


class StartApproved(Handler[PlanApproved]):
    def handle(self, event: PlanApproved, chat: Chat) -> list[Fact]:
        chat.say("approved", n=event.plan, title=event.title)
        return []


class TellParkedAndPickedUp(Handler[PlanMovedByUser]):
    def handle(self, event: PlanMovedByUser, chat: Chat) -> list[Fact]:
        chat.say(event.line, n=event.plan, title=event.title, phase=event.phase)
        return []


class GuideBuilding(Handler[PlanBuildingGuided]):
    def handle(self, event: PlanBuildingGuided, chat: Chat) -> list[Fact]:
        chat.say(event.line, n=event.plan)
        return []


class DelegatePlansOfHandedRows(Handler[PlanHandedToHelper]):
    def handle(self, event: PlanHandedToHelper, plans: Rows[Plan]) -> list[Fact]:
        plans.delegate(event.plan)
        return []


class PassCheckpointsInAuto(Handler[CheckpointPassed]):
    def handle(self, event: CheckpointPassed, plans: Rows[Plan]) -> list[Fact]:
        plans.resume(event.plan)
        return []


class AdvancePlans(Handler[PlansToAdvance]):
    def handle(self, event: PlansToAdvance, plans: Rows[Plan]) -> list[Fact]:
        plans.catch_up(event.passing)
        return []


class ReopenPlansWithTheirRows(Handler[PlanRowReopened]):
    def handle(self, event: PlanRowReopened, plans: Rows[Plan]) -> list[Fact]:
        plan = plans.reopen(event.plan, why=f"{event.type} {event.n} of phase {event.phase} was reopened") if event.was_done else plans.load(event.plan)
        plan.status, plan.current = ACTIVE, event.phase
        plans.save(plan, "updated", phase=event.phase, status=ACTIVE)
        return []


class TakeStruckRowsOutOfUnapprovedPlans(Handler[StruckRowInUnapprovedPlan]):
    def handle(self, event: StruckRowInUnapprovedPlan, plans: Rows[Plan]) -> list[Fact]:
        plans.place(event.plan, event.phase, [event.todo], off=True)
        return []


class EndReviewWithItsReport(Handler[ReviewReportLinked]):
    def handle(self, event: ReviewReportLinked, plans: Rows[Plan]) -> list[Fact]:
        plans.build(event.plan)
        return []


class TellReviewEnded(Handler[ReviewEndedWithReport]):
    def handle(self, event: ReviewEndedWithReport, chat: Chat) -> list[Fact]:
        chat.say("reviewed", n=event.plan, title=event.title, report=event.report)
        return []

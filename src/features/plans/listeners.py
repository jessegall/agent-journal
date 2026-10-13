from events import Fact
from events.agents import ClockTicked
from events.plans import (CheckpointPassed, PlanApproved, PlanBuildBegun, PlanBuildingGuided, PlanChanged, PlanHandedToHelper, PlanMovedByUser, PlanRowReopened,
                          PlansToAdvance, ReviewEndedWithReport, ReviewReportLinked, StruckRowInUnapprovedPlan)
from events.reports import ReportLinked
from events.resources import AnyEvent, RowReopened
from events.todos import TodoCompleted, TodoUpdated
from receiving import Listener
from resources.base import AGENT, SYSTEM, USER
from resources.plans import ABANDONED, ACTIVE, APPROVED, BUILDING, DEPTHS, DRAFT, PARKED, PHASE_FIELDS, PHASES, READY, REVIEWING, RUNNING, WAITING
from resources.types import AgentRow, Plan, Todo
from serving import ReadRows

ADVANCES = {("todo", "completed"), ("ticket", "completed"), ("plan", "updated"), ("agent", "reported")}


class SpotPlanBegun(Listener[PlanChanged]):
    def listen(self, event: PlanChanged, plans: ReadRows[Plan], agents: ReadRows[AgentRow]) -> list[Fact]:
        if event.action != "created" or event.actor != USER or not agents.has_primary():
            return []
        plan = plans.peek(event.n)
        return [PlanBuildBegun(plan=plan.n, title=plan.title, depth=DEPTHS[plan.depth])]


class SpotApprovedPlan(Listener[PlanChanged]):
    def listen(self, event: PlanChanged, plans: ReadRows[Plan], agents: ReadRows[AgentRow]) -> list[Fact]:
        if event.action != "updated" or event.actor not in (USER, SYSTEM) or not agents.has_primary():
            return []
        plan = plans.peek(event.n)
        return [PlanApproved(plan=plan.n, title=plan.title).once(f"approved|{plan.n}")] if plan.status == APPROVED else []


class SpotPlanMovedByUser(Listener[PlanChanged]):
    def listen(self, event: PlanChanged, plans: ReadRows[Plan], agents: ReadRows[AgentRow]) -> list[Fact]:
        if event.action != "updated" or event.actor != USER or event.status not in (ACTIVE, PARKED) or event.parked_for or not agents.has_primary():
            return []
        plan = plans.peek(event.n)
        return [PlanMovedByUser(line="picked up" if event.status == ACTIVE else "parked", plan=plan.n, title=plan.title, phase=plan.current)]


class SpotBuildingToGuide(Listener[PlanChanged]):
    def listen(self, event: PlanChanged, plans: ReadRows[Plan], agents: ReadRows[AgentRow]) -> list[Fact]:
        if not (event.written or event.action == "linked") or event.actor != AGENT or not agents.has_primary():
            return []
        plan = plans.peek(event.n)
        if plan.status != BUILDING:
            return []
        stage = plan.stage or PHASES
        line = "ready" if stage != PHASES and bool(plan.phases) and not plan.empty_phases() else stage
        return [PlanBuildingGuided(plan=plan.n, line=line).once(f"planned|{plan.n}:{line}")]


class SpotPlanOfHandedRow(Listener[TodoUpdated]):
    def listen(self, event: TodoUpdated, todos: ReadRows[Todo], plans: ReadRows[Plan]) -> list[Fact]:
        row = todos.peek(event.n)
        if not row.assigned.startswith("helper:") or row.completed:
            return []
        return [PlanHandedToHelper(plan=plan.n) for plan in plans.rows.every() if plan.status in RUNNING and plan.has_in_phase(row)]


class SpotCheckpointToPass(Listener[ClockTicked]):
    def listen(self, event: ClockTicked, plans: ReadRows[Plan]) -> list[Fact]:
        if not plans.passes_checkpoints():
            return []
        return [CheckpointPassed(plan=plan.n) for plan in plans.rows.every() if plan.status == WAITING]


class SpotPlansToAdvance(Listener[AnyEvent]):
    def listen(self, event: AnyEvent, plans: ReadRows[Plan]) -> list[Fact]:
        return [PlansToAdvance(passing=plans.passes_checkpoints())] if (event.type, event.action) in ADVANCES else []


class SpotReopenedRowOfAPlan(Listener[RowReopened]):
    def listen(self, event: RowReopened, plans: ReadRows[Plan]) -> list[Fact]:
        if event.type not in PHASE_FIELDS:
            return []
        found = []
        for plan in plans.rows.every():
            phase = plan.phase_of(event.type, event.n)
            if phase and plan.status != ABANDONED and (plan.completed or (plan.status in RUNNING and plan.current > phase)):
                found.append(PlanRowReopened(plan=plan.n, type=event.type, n=event.n, phase=phase, was_done=bool(plan.completed)))
        return found


class SpotStruckRowOfAnUnapprovedPlan(Listener[TodoCompleted]):
    def listen(self, event: TodoCompleted, todos: ReadRows[Todo], plans: ReadRows[Plan]) -> list[Fact]:
        if not todos.peek(event.n).data.get("struck"):
            return []
        found = []
        for plan in plans.rows.every():
            phase = plan.phase_of("todo", event.n)
            if phase and plan.status in (BUILDING, DRAFT, READY, REVIEWING):
                found.append(StruckRowInUnapprovedPlan(plan=plan.n, phase=phase, todo=event.n))
        return found


class SpotReviewReport(Listener[ReportLinked]):
    def listen(self, event: ReportLinked, plans: ReadRows[Plan], agents: ReadRows[AgentRow]) -> list[Fact]:
        plan = plans.under_review(event.to)
        if not plan:
            return []
        found = [ReviewReportLinked(plan=plan.n)]
        return found + [ReviewEndedWithReport(plan=plan.n, title=plan.title, report=event.n)] if agents.has_primary() else found

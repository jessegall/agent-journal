from journal.features.plans.support.plans_readings import PlansReadings
from journal.features.plans.support.started_plan import StartedPlan
from journal.models.agent import Agent
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans
from journal.support.task_briefing import TaskBriefing

NOTHING_YET = "it has no brief and nothing logged yet"


class PlansReadingsReader:
    """Reads the plans feature's part of the Readings for an agent."""

    def __init__(self, plans: Plans, briefing: TaskBriefing) -> None:
        self.plans, self.briefing = plans, briefing

    def read(self, agent: Agent) -> PlansReadings:
        started = next((p for p in self.plans.in_() if p.state == PlanState.STARTED), None)
        return PlansReadings(approved=tuple(p.id for p in self.plans.approved()), started=self.started_plan(started) if started else None)

    def started_plan(self, plan: Plan) -> StartedPlan:
        tree = self.plans.tree(plan)
        tasks = tree.tasks
        task = self.plans.resumable_task(tree)
        current = next((t for t in tasks if t.state == TaskState.STARTED), None)
        briefing = (self.briefing.said(current) or NOTHING_YET) if current else ""
        checkpoint = plan.checkpoint_at(list(tree.phased))
        phase = checkpoint.number if checkpoint is not None else 0
        return StartedPlan(plan_id=plan.id, next_task=task.id if task else 0, started_task=current.id if current else 0, started_task_briefing=briefing, tasks=tuple(t.id for t in tasks), tasks_left=sum(1 for t in tasks if not t.is_closed()), at_checkpoint=checkpoint is not None, checkpoint_phase=phase)

from journal.features.plans.support.plans_data import PlansData
from journal.features.plans.support.started_plan import StartedPlan
from journal.models.agent import Agent
from journal.models.plan import Plan
from journal.models.plan_state import PlanState
from journal.models.task_state import TaskState
from journal.repositories.plans import Plans
from journal.features.tasks.support.task_briefing import TaskBriefing

EMPTY_PLAN_NOTE = "it has no brief and nothing logged yet"


class PlansDataReader:
    """Reads the plans feature's part of the feature data for an agent."""

    def __init__(self, plans: Plans, briefing: TaskBriefing) -> None:
        self.plans, self.briefing = plans, briefing

    def read(self, agent: Agent) -> PlansData:
        started = next((p for p in self.plans.scoped() if p.state == PlanState.STARTED), None)
        return PlansData(approved=tuple(p.id for p in self.plans.approved()), started=self.started_plan(started) if started else None)

    def started_plan(self, plan: Plan) -> StartedPlan:
        tree = self.plans.tree(plan)
        tasks = tree.tasks
        task = self.plans.resumable_task(tree)
        current = next((t for t in tasks if t.state == TaskState.STARTED), None)
        briefing = (self.briefing.text(current) or EMPTY_PLAN_NOTE) if current else ""
        checkpoint = plan.checkpoint_phase(list(tree.phased))
        phase = checkpoint.number if checkpoint is not None else 0
        return StartedPlan(plan_id=plan.id, next_task=task.id if task else 0, started_task=current.id if current else 0, started_task_briefing=briefing, tasks=tuple(t.id for t in tasks), remaining_tasks=sum(1 for t in tasks if not t.is_closed()), checkpoint_pause=checkpoint is not None, checkpoint_phase=phase)

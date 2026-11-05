from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.plans.commands.start_plan.start_plan import StartPlan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.plan_task import PlanTask
from core.base.change.moved import Moved
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class StartedTaskPlanListener(CommitListener[Moved[Task]]):
    """A task started inside an approved plan starts the plan, so a plan never stays approved while its work goes."""

    name = "plans.started-task-plan"
    moves = (TaskLifecycle.start,)

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        places = self.queries.query(PlanTask).filter(task_id=logged.row_id).page(1, 1).rows
        plan = self.queries.query(Plan).find(places[0].plan_id) if places else None
        if plan is not None and plan.state is PlanState.APPROVED:
            self.bus.run(StartPlan(plan.id), Actor.core(), cause_id=logged.id, environment_id=plan.environment_id)

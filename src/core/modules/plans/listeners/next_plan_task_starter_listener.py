from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.next_plan_tasks import NextPlanTasks
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.models.support.task_priority import CRITICAL_PRIORITY


class NextPlanTaskStarterListener(CommitListener):
    """When an agent closes a task of a started plan, the plan's next open task that waits on nothing is
    started for that agent, so a plan is followed task by task, never past a checkpoint phase that still
    has an open task."""

    name = "plans.next-plan-task-starter"
    event = "task.close"

    def __init__(self, bus: Bus, queries: Queries, next_tasks: NextPlanTasks, tasks: TaskQuery) -> None:
        self.bus, self.queries, self.next_tasks, self.tasks = bus, queries, next_tasks, tasks

    def handle(self, event: LoggedEvent) -> None:
        places = self.queries.query(PlanTask).filter(task_id=event.row_id).page(1, 1).rows
        plan = self.queries.query(Plan).find(places[0].plan_id) if places else None
        if plan is None or plan.state is not PlanState.STARTED or self.tasks.holder(event.actor_id).started().exists() or self.critical_task_waits(plan.environment_id):
            return
        following = self.next_tasks.following(places[0].plan_id)
        if following is not None:
            self.bus.run(StartTask(following), Actor(event.actor_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)

    def critical_task_waits(self, environment_id: int) -> bool:
        most_urgent = self.tasks.next_open(environment_id, None, self.next_tasks.plan_exclusion())
        return most_urgent is not None and most_urgent.priority >= CRITICAL_PRIORITY

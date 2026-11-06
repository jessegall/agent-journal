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
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners
from core.modules.tasks.models.support.task_priority import URGENT_PRIORITY
from core.base.change.moved import Moved
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class NextPlanTaskStarterListener(CommitListener[Moved[Task]]):
    """When an agent closes a task of a started plan, the plan's next open task that waits on nothing is
    started for that agent, so a plan is followed task by task, never past a checkpoint phase that still
    has an open task. A suite with no task assigner hands out nothing."""

    name = "plans.next-plan-task-starter"
    moves = tuple([TaskLifecycle.close])

    def __init__(self, bus: Bus, queries: Queries, next_tasks: NextPlanTasks, tasks: TaskQuery, assigners: SuiteTaskAssigners) -> None:
        self.bus, self.queries, self.next_tasks, self.tasks, self.assigners = bus, queries, next_tasks, tasks, assigners

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        place = self.queries.query(PlanTask).filter(task_id=logged.row_id).first()
        plan = self.queries.query(Plan).find(place.plan_id) if place is not None else None
        if plan is None or self.assigners.assigner() is None or plan.state is not PlanState.STARTED or self.tasks.holder(logged.actor_id).started().exists() or self.urgent_task_waits():
            return
        following = self.next_tasks.following(place.plan_id)
        if following is not None:
            self.bus.run(StartTask(following), Actor(logged.actor_id, ActorType.AGENT), cause_id=logged.id)

    def urgent_task_waits(self) -> bool:
        most_urgent = self.tasks.next_open(None, self.next_tasks.plan_exclusion())
        return most_urgent is not None and most_urgent.priority >= URGENT_PRIORITY

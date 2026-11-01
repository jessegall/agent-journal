from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.conditions.subquery_match import SubqueryMatch
from core.base.query.queries import Queries
from core.base.query.select import Select
from core.modules.plans.listeners.support.checkpoint_limit import CheckpointLimit
from core.modules.plans.models.plan import Plan
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.commands.start_task import StartTask
from core.modules.tasks.models.open_dependency import OpenDependency
from core.modules.tasks.models.enums.task_priority import TaskPriority
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task

URGENCY = {TaskPriority.HIGH: 0, TaskPriority.NORMAL: 1, TaskPriority.LOW: 2}


class NextPlanTaskStarterListener(CommitListener):
    """When an agent closes a task, the task it takes next is started for that agent at once: the next open task of
    the plan the closed one belonged to, when that plan is started, that waits on nothing and lies before any
    checkpoint phase that still has an open task, else the most urgent open task of the environment, the oldest
    first among the same urgency."""

    name = "plans.next-plan-task-starter"
    event = "task.close"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: LoggedEvent) -> None:
        closed = self.queries.query(Task).find(event.row_id)
        agent_id = self.successor(event, closed)
        if agent_id is None or self.queries.query(Task).filter(holder_id=agent_id, state=TaskState.STARTED).exists():
            return
        following = self.next_plan_task(event) or self.urgent_open_task(closed.environment_id)
        if following is not None:
            self.bus.run(StartTask(following), Actor(agent_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)

    def successor(self, event: LoggedEvent, closed: Task) -> int | None:
        return closed.holder_id if closed.holder_id is not None else event.actor_id

    def next_plan_task(self, event: LoggedEvent) -> int | None:
        places = self.queries.query(PlanTask).filter(task_id=event.row_id).page(1, 1).rows
        if not places or self.queries.query(Plan).find(places[0].plan_id).state is not PlanState.STARTED:
            return None
        plan_id = places[0].plan_id
        waiting = SubqueryMatch("task_id", Select(OpenDependency.view).column("task_id"), negated=True)
        free_tasks = self.queries.query(PlanTask).filter(plan_id=plan_id, state=TaskState.OPEN).matching(waiting).matching(CheckpointLimit(plan_id))
        following = free_tasks.ordered("phase_position", "position").page(1, 1).rows
        return following[0].task_id if following else None

    def urgent_open_task(self, environment_id: int) -> int | None:
        open_tasks = list(self.queries.query(Task).filter(environment_id=environment_id, state=TaskState.OPEN).all_rows())
        return min(open_tasks, key=lambda task: (URGENCY[task.priority], task.id)).id if open_tasks else None


class NextTaskAfterCancelListener(NextPlanTaskStarterListener):
    """The same succession when an agent cancels the task it had."""

    name = "plans.next-task-after-cancel"
    event = "task.cancel"

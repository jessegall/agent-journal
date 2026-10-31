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
from core.modules.tasks.models.enums.task_state import TaskState


class NextPlanTaskStarterListener(CommitListener):
    """When an agent closes a task of a started plan, the plan's next open task that waits on nothing is
    started for that agent, so a plan is followed task by task, never past a checkpoint phase that still
    has an open task."""

    name = "plans.next-plan-task-starter"
    event = "task.close"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: LoggedEvent) -> None:
        places = self.queries.query(PlanTask).filter(task_id=event.row_id).page(1, 1).rows
        if not places or self.queries.query(Plan).find(places[0].plan_id).state is not PlanState.STARTED:
            return
        plan_id = places[0].plan_id
        waiting = SubqueryMatch("task_id", Select(OpenDependency.view).column("task_id"), negated=True)
        free_tasks = self.queries.query(PlanTask).filter(plan_id=plan_id, state=TaskState.OPEN).matching(waiting).matching(CheckpointLimit(plan_id))
        following = free_tasks.ordered("phase_position", "position").page(1, 1).rows
        if following:
            self.bus.run(StartTask(following[0].task_id), Actor(event.actor_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)

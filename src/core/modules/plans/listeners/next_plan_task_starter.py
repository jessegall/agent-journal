from core.base.actor import Actor, ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.plans.plan import Plan, PlanState
from core.modules.plans.plan_task import PlanTask
from core.modules.tasks.commands import TaskStart
from core.modules.tasks.task import TaskState


class NextPlanTaskStarter(CommitListener):
    """When an agent closes a task of a started plan, the plan's next open task is started for that agent, so a
    plan is followed task by task."""

    name = "plans.next-plan-task-starter"
    event = "task.close"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: LoggedEvent) -> None:
        places = self.queries.query(PlanTask).filter(task_id=event.row_id).page(1, 1).rows
        if not places or self.queries.query(Plan).find(places[0].plan_id).state is not PlanState.STARTED:
            return
        following = self.queries.query(PlanTask).filter(plan_id=places[0].plan_id, state=TaskState.OPEN).ordered("phase_position", "position").page(1, 1).rows
        if following:
            self.bus.run(TaskStart(following[0].task_id), Actor(event.actor_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)

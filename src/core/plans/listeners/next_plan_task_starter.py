from core.base.actor import Actor, ActorType
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.plans.plan import Plan, PlanState
from core.plans.plan_tasks import PlanTasks
from core.tasks.commands import TaskStart
from core.tasks.task import TaskState


class NextPlanTaskStarter(CommitListener):
    """When an agent closes a task of a started plan, the plan's next open task is started for that agent, so a
    plan is followed task by task."""

    name = "plans.next-plan-task-starter"
    event = "task.close"

    def __init__(self, bus: Bus, queries: Queries, plan_tasks: PlanTasks) -> None:
        self.bus, self.queries, self.plan_tasks = bus, queries, plan_tasks

    def handle(self, event: LoggedEvent) -> None:
        plan_id = self.plan_tasks.plan_id(event.row_id)
        if plan_id is None or self.queries.query(Plan).find(plan_id).state is not PlanState.STARTED:
            return
        next_task = next((task for task in self.plan_tasks.ordered(plan_id) if task.state is TaskState.OPEN), None)
        if next_task is None:
            return
        self.bus.run(TaskStart(next_task.id), Actor(event.actor_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)

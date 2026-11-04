from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.tasks.commands.start_task.start_task import StartTask
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from core.modules.tasks.support.suite_task_assigners import SuiteTaskAssigners

LEAVES_HAND = ("task.close", "task.cancel", "task.block", "task.release")
HOLDER_FIELD = "holder_id"
RELEASE_EVENT = "task.release"


class AutoNextTaskListener(CommitListener):
    """While the suite's task assigner hands out tasks by itself, a task that leaves the main agent's hands, closed,
    cancelled, blocked or released, is followed at once by the next task, started for that agent; with other
    tasks still in its hands, only an urgent task is started."""

    name = "tasks.auto-next-task"
    event = "task.*"

    def __init__(self, bus: Bus, queries: Queries, tasks: TaskQuery, assigners: SuiteTaskAssigners) -> None:
        self.bus, self.queries, self.tasks, self.assigners = bus, queries, tasks, assigners

    def handle(self, event: LoggedEvent) -> None:
        if event.event not in LEAVES_HAND:
            return
        closed_task = self.queries.query(Task).find(event.row_id)
        assigner = self.assigners.assigner(closed_task.environment_id)
        if assigner is None or not assigner.is_automatic(closed_task.environment_id):
            return
        holder_id = event.data[HOLDER_FIELD][0] if HOLDER_FIELD in event.data else closed_task.holder_id
        if not isinstance(holder_id, int):
            return
        holder = self.queries.query(Agent).find(holder_id)
        if holder.role != AgentRole.MAIN or holder.ended_at is not None:
            return
        excluded_id = closed_task.id if event.event == RELEASE_EVENT else None
        select_next = assigner.urgent if self.tasks.holder(holder_id).started().exists() else assigner.following
        next_row = select_next(closed_task.environment_id, excluded_id)
        if next_row is not None:
            self.bus.run(StartTask(next_row.id), Actor(holder_id, ActorType.AGENT), cause_id=event.id, environment_id=event.environment_id)

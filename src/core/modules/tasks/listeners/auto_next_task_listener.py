from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.base.change.moved import Moved
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



class AutoNextTaskListener(CommitListener[Moved[Task]]):
    """While the suite's task assigner hands out tasks by itself, a task that leaves the main agent's hands, closed,
    cancelled, blocked or released, is followed at once by the next task, started for that agent; with other
    tasks still in its hands, only an urgent task is started."""

    name = "tasks.auto-next-task"
    moves = (TaskLifecycle.close, TaskLifecycle.cancel, TaskLifecycle.block, TaskLifecycle.release)

    def __init__(self, bus: Bus, queries: Queries, tasks: TaskQuery, assigners: SuiteTaskAssigners) -> None:
        self.bus, self.queries, self.tasks, self.assigners = bus, queries, tasks, assigners

    def handle(self, event: Moved[Task], logged: LoggedEvent) -> None:
        closed_task = event.row
        assigner = self.assigners.assigner(closed_task.environment_id)
        if assigner is None or not assigner.is_automatic(closed_task.environment_id):
            return
        holder_id = event.old_row.holder_id
        if holder_id is None:
            return
        holder = self.queries.query(Agent).find(holder_id)
        if holder.role != AgentRole.MAIN or holder.ended_at is not None:
            return
        excluded_id = closed_task.id if event.move is TaskLifecycle.release else None
        select_next = assigner.urgent if self.tasks.holder(holder_id).started().exists() else assigner.following
        next_row = select_next(closed_task.environment_id, excluded_id)
        if next_row is not None:
            self.bus.run(StartTask(next_row.id), Actor(holder_id, ActorType.AGENT), cause_id=logged.id, environment_id=logged.environment_id)

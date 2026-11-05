from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.modules.tasks.queries.task_query import TaskQuery
from core.base.change.moved import Moved
from core.base.command.context import Context
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task


class WorkerTaskGuard(Guard[Moved[Task]]):
    """Refuses a worker a second started task: a worker works on one task."""

    name = "workers.one-task-per-worker"
    moves = (TaskLifecycle.start,)

    def __init__(self, queries: Queries, tasks: TaskQuery) -> None:
        self.queries, self.tasks = queries, tasks

    def check(self, event: Moved[Task], context: Context) -> None:
        if not self.queries.query(Agent).filter(id=context.actor.id, role=AgentRole.WORKER).exists():
            return
        started_tasks = self.tasks.holder(context.actor.id).started().page(1, 1).rows
        if started_tasks and started_tasks[0].id != event.row.id:
            raise Refusal(f"worker {context.actor.id} has task {started_tasks[0].id} started already", "a worker works on one task at a time: deliver it first")

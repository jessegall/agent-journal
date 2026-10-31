from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.base.agent_role import AgentRole
from core.modules.tasks.queries.task_query import TaskQuery


class WorkerTaskGuard(Guard):
    """Refuses a worker a second started task: a worker works on one task."""

    name = "workers.one-task-per-worker"
    event = "task.start"

    def __init__(self, queries: Queries, tasks: TaskQuery) -> None:
        self.queries, self.tasks = queries, tasks

    def check(self, change: Change[Model]) -> None:
        if not self.queries.query(Agent).filter(id=change.actor.id, role=AgentRole.WORKER).exists():
            return
        started_tasks = self.tasks.holder(change.actor.id).started().page(1, 1).rows
        if started_tasks and started_tasks[0].id != change.row.id:
            raise Refusal(f"worker {change.actor.id} has task {started_tasks[0].id} started already", "a worker works on one task: deliver it first")

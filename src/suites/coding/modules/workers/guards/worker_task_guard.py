from core.base.guard.guard import Guard
from core.base.listener.event_rows import EventRows
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
    moves = tuple([TaskLifecycle.start])

    def __init__(self, rows: EventRows, tasks: TaskQuery) -> None:
        self.rows, self.tasks = rows, tasks

    def check(self, event: Moved[Task], context: Context) -> None:
        agent = self.rows.find(Agent, context.actor.id)
        if agent is None or agent.role != AgentRole.WORKER:
            return
        started_tasks = self.tasks.started_tasks(context.actor.id)
        if started_tasks and started_tasks[0].id != event.row.id:
            raise Refusal(f"worker {context.actor.id} has task {started_tasks[0].id} started already", "a worker works on one task at a time: deliver it first")

from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.event.moved import Moved
from engine.guard.guard import Guard
from engine.listener.event_rows import EventRows
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.worker_task_limit import WorkerTaskLimit


class WorkerStartedTasksGuard(Guard[Moved[Task]]):
    """Refuses a worker one more started task once it has started as many as the setting allows at once."""

    name = "workers.most-open-tasks"
    moves = tuple([TaskLifecycle.start])

    def __init__(self, rows: EventRows, limit: WorkerTaskLimit) -> None:
        self.rows, self.limit = rows, limit

    def check(self, event: Moved[Task], context: Context) -> None:
        agent = self.rows.find(Agent, context.actor.id)
        if agent is None or agent.role != CodingHelperRole.WORKER:
            return
        count = self.limit.started_count(agent.id, event.row)
        if count >= self.limit.maximum():
            raise Refusal(f"you hold {count} {'task' if count == 1 else 'tasks'}, the most allowed", "commit some of them, then start another")

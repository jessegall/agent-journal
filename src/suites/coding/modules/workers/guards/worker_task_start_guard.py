from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from engine.command.context import Context
from engine.event.moved import Moved
from engine.guard.guard import Guard
from engine.listener.rows.event_rows import EventRows
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.worker_task_access import WorkerTaskAccess


class WorkerTaskStartGuard(Guard[Moved[Task]]):
    """Refuses a worker the start of a task that another agent has started or that is blocked, and says who
    has it or what blocks it. It is asked before the lifecycle, whose refusal names moves that are not the
    worker's to make."""

    name = "workers.task-held-by-another"
    moves = tuple([TaskLifecycle.start])
    runs_first = True

    def __init__(self, rows: EventRows, access: WorkerTaskAccess) -> None:
        self.rows, self.access = rows, access

    def check(self, event: Moved[Task], context: Context) -> None:
        agent = self.rows.find(Agent, context.actor.id)
        task = event.old_row
        if agent is None or agent.role != CodingHelperRole.WORKER or task is None:
            return
        if task.state is TaskState.BLOCKED or (task.state is TaskState.STARTED and task.holder_id != agent.id):
            raise self.access.refusal(task, agent.id)

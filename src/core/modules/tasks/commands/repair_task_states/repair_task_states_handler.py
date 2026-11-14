from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.tasks.commands.repair_task_states.repair_task_states import RepairTaskStates
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from core.modules.tasks.support.task_waits import TaskWaits

TASK_TARGET = "tasks:"
ENDED_TASK_STATES = (TaskState.COMPLETED, TaskState.CANCELLED)
KEPT_OPEN_REASON = "every open task that still names a holder is repaired"


class RepairTaskStatesHandler(Handler[RepairTaskStates, int]):
    """Ends each wait on a task that has ended, which opens the waiting task when it was its last, and clears the
    holder an open task kept; each repair is logged on its task."""

    command = RepairTaskStates

    def __init__(self, queries: Queries, repository: Repository, waits: TaskWaits) -> None:
        self.queries, self.repository, self.waits = queries, repository, waits

    def handle(self, command: RepairTaskStates, context: Context) -> int:
        return self.ended_task_waits(context) + self.open_task_holders(context)

    def ended_task_waits(self, context: Context) -> int:
        targeted = [(wait, int(wait.target.removeprefix(TASK_TARGET))) for wait in self.waits.pending_rows() if wait.target.startswith(TASK_TARGET)]
        ended_ids = {task.id for task in self.queries.query(Task).find_many(sorted({task_id for _, task_id in targeted})) if task.state in ENDED_TASK_STATES}
        stale = [(wait, task_id) for wait, task_id in targeted if task_id in ended_ids]
        for wait, task_id in stale:
            self.log(wait.task_id, f"its wait on task {task_id} ended: that task had ended", context)
        self.waits.resolved([wait for wait, _ in stale], context)
        return len(stale)

    def open_task_holders(self, context: Context) -> int:
        kept = tuple(self.queries.query(Task).filter(state=TaskState.OPEN).matching(HasValue("holder_id")).every_row(KEPT_OPEN_REASON))
        for task in kept:
            self.repository.update(task, context, holder_id=None)
            self.log(task.id, f"the holder it kept while open was cleared (agent {task.holder_id})", context)
        return len(kept)

    def log(self, task_id: int, line: str, context: Context) -> None:
        self.repository.save(TaskLog(task_id=task_id, creator_id=context.actor.id, line=f"repaired by the state sweep: {line}"), context)

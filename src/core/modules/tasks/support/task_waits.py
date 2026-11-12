from collections.abc import Sequence

from core.modules.tasks.support.task_nudges import TASK_REOPENED
from engine.database.kept_rows import KeptRows
from engine.command.context import Context
from engine.driver.nudger import Nudger
from engine.query.conditions.among import Among
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.query.kept_row_changes import KeptRowChanges
from core.modules.assignments.support.assignments import Assignments
from engine.repository.repository import Repository
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.agents.support.main_agent_finder import MainAgentFinder


WAIT_ENDED_SOURCE = "tasks.wait-ended"

TASK_TARGET_PREFIX = "tasks:"

ENDED_WAITS_REASON = "Every task whose wait just ended is opened; a task many others wait on ends many waits at once."
KEPT_WAITS_REASON = "The open waits are read once and kept on the server, so a listener that ends waits for many targets reads no row per target."


class TaskWaits(KeptRowChanges[TaskWait]):
    """Ends a blocked task's waits, and opens the task when the last of them has ended."""

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger, kept: KeptRows, assignments: Assignments) -> None:
        self.queries, self.repository, self.nudger, self.assignments = queries, repository, nudger, assignments
        self.kept = kept

    def resolved(self, waits: Sequence[TaskWait], context: Context) -> None:
        for wait in waits:
            self.repository.update(wait, context, ended_at=context.timestamp)
        opened = [task for task in self.queries.query(Task).matching(Among("id", list(dict.fromkeys(wait.task_id for wait in waits)))).oldest().full_table(ENDED_WAITS_REASON).all_rows()
                  if task.state is TaskState.BLOCKED and not self.pending_task(task.id)]
        if not opened:
            return
        self.assignments.keep_rows(Task, [task.id for task in opened])
        for task in opened:
            self.repository.save_change(task, task.moved(TaskLifecycle.unblock), context)
        self.notify_agents(opened, context)

    def waits_target_tasks(self, task_id: int) -> bool:
        return all(wait.target.startswith(TASK_TARGET_PREFIX) for wait in self.pending_task(task_id))

    def notify_agents(self, tasks: Sequence[Task], context: Context) -> None:
        actor_ids = self.assignments.row_actor_ids(Task, [task.id for task in tasks])
        for agent in MainAgentFinder.rows(self.queries):
            for task in tasks:
                if not actor_ids[task.id] or agent.id in actor_ids[task.id]:
                    self.nudger.send(agent.id, TASK_REOPENED, WAIT_ENDED_SOURCE, context, task=task.id)

    def open_waits(self, task_id: int):
        return self.queries.query(TaskWait).filter(task_id=task_id).matching(IsNull("ended_at"))

    def pending_task(self, task_id: int) -> tuple[TaskWait, ...]:
        return tuple(wait for wait in self.pending_rows() if wait.task_id == task_id)

    def pending_target(self, target: str) -> tuple[TaskWait, ...]:
        return tuple(wait for wait in self.pending_rows() if wait.target == target)

    def pending_rows(self) -> tuple[TaskWait, ...]:
        return self.kept.read("task_waits", lambda: tuple(self.queries.query(TaskWait).matching(IsNull("ended_at")).oldest().full_table(KEPT_WAITS_REASON).all_rows()),
                              "ended_at IS NULL", name="tasks.pending_waits")

    def kept_rows(self, wait: TaskWait) -> tuple[TaskWait, ...]:
        return tuple([wait]) if wait.ended_at is None else ()

    def update_kept(self, wait: TaskWait, pending: tuple[TaskWait, ...]) -> None:
        def with_pending(waits: tuple[TaskWait, ...]) -> tuple[TaskWait, ...]:
            return tuple(sorted([row for row in waits if row.id != wait.id] + list(pending), key=lambda row: row.id))

        self.kept.update("task_waits", with_pending, "ended_at IS NULL", name="tasks.pending_waits")

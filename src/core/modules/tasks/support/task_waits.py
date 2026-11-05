from core.modules.tasks.support.task_nudges import TASK_REOPENED
from core.base.database.kept_rows import KeptRows
from core.base.command.context import Context
from core.modules.drivers.support.nudger import Nudger
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait
from core.modules.agents.support.main_agent_finder import MainAgentFinder


WAIT_ENDED_SOURCE = "tasks.wait-ended"


class TaskWaits:
    """Ends a blocked task's waits, and opens the task when the last of them has ended."""

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger, kept: KeptRows) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger
        self.kept = kept

    def resolved(self, wait: TaskWait, context: Context) -> None:
        self.repository.update(wait, context, ended_at=context.timestamp)
        task = self.queries.query(Task).find(wait.task_id)
        if task.state is TaskState.BLOCKED and not self.pending_task(task.id):
            self.repository.save_change(task, task.moved(TaskLifecycle.unblock), context)
            self.notify_agents(task, context)

    def notify_agents(self, task: Task, context: Context) -> None:
        for agent in tuple(MainAgentFinder.rows(self.queries, task.environment_id)):
            self.nudger.send(agent.id, TASK_REOPENED, WAIT_ENDED_SOURCE, context, task=task.id)

    def open_waits(self, task_id: int):
        return self.queries.query(TaskWait).filter(task_id=task_id).matching(IsNull("ended_at"))

    def pending_task(self, task_id: int) -> tuple[TaskWait, ...]:
        return self.kept.read("task_waits", lambda: tuple(self.open_waits(task_id).all_rows()),
                              "task_id = ? AND ended_at IS NULL", [task_id], name="tasks.pending_waits")

    def pending_target(self, target: str) -> tuple[TaskWait, ...]:
        return self.kept.read("task_waits", lambda: tuple(self.queries.query(TaskWait).filter(target=target).matching(IsNull("ended_at")).all_rows()),
                              "target = ? AND ended_at IS NULL", [target], name="tasks.pending_waits")

    def remember(self, wait: TaskWait) -> None:
        self.replace_cached(wait, tuple([wait]) if wait.ended_at is None else ())

    def remove(self, wait: TaskWait) -> None:
        self.replace_cached(wait, ())

    def replace_cached(self, wait: TaskWait, pending: tuple[TaskWait, ...]) -> None:
        for column, value in (("task_id", wait.task_id), ("target", wait.target)):
            self.kept.update("task_waits", lambda waits: (*[row for row in waits if row.id != wait.id], *pending),
                             f"{column} = ? AND ended_at IS NULL", [value], name="tasks.pending_waits")

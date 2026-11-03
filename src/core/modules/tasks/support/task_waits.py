from core.modules.tasks.support.task_nudges import TASK_REOPENED
from dataclasses import replace

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

    def __init__(self, queries: Queries, repository: Repository, nudger: Nudger) -> None:
        self.queries, self.repository, self.nudger = queries, repository, nudger

    def resolved(self, wait: TaskWait, context: Context) -> None:
        self.repository.save(replace(wait, ended_at=context.timestamp), context)
        task = self.queries.query(Task).find(wait.task_id)
        if task.state is TaskState.BLOCKED and not self.open_waits(task.id).exists():
            self.repository.save(task.moved(TaskLifecycle.unblock), context)
            self.notify_agents(task, context)

    def notify_agents(self, task: Task, context: Context) -> None:
        for agent in tuple(MainAgentFinder.rows(self.queries, task.environment_id)):
            self.nudger.send(agent.id, TASK_REOPENED, WAIT_ENDED_SOURCE, context, task=task.id)

    def open_waits(self, task_id: int):
        return self.queries.query(TaskWait).filter(task_id=task_id).matching(IsNull("ended_at"))

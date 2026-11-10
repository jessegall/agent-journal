from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from engine.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task


class TaskStopped(BlockCondition):
    """This task is no longer started."""

    name = "task-stopped"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Task).find(int(self.text)).state is not TaskState.STARTED

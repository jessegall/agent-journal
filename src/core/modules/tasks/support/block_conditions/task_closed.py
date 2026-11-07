from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task


class TaskClosed(BlockCondition):
    """This task is completed or cancelled."""

    name = "task-closed"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Task).find(int(self.text)).state in (TaskState.COMPLETED, TaskState.CANCELLED)

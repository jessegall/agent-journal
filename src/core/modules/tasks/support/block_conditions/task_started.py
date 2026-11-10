from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from engine.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task


class TaskStarted(BlockCondition):
    """This task has been started."""

    name = "task-started"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Task).find(int(self.text)).state is TaskState.STARTED

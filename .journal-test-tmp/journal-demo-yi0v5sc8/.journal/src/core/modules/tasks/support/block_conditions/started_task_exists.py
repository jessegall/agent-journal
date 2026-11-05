from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task


class StartedTaskExists(BlockCondition):
    """The agent holds a started task."""

    name = "task-in-hand"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(Task).filter(holder_id=check.hook.agent_id, state=TaskState.STARTED).exists()

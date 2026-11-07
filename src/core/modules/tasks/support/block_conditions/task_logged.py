from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.modules.tasks.models.task_log import TaskLog


class TaskLogged(BlockCondition):
    """This task got a log line since the block opened."""

    name = "task-logged"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(TaskLog).filter(task_id=int(self.text)).matching(Greater("created_at", check.opened_at.text)).exists()

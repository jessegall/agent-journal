from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from core.modules.tasks.models.task_log import TaskLog


class TaskLogged(BlockCondition):
    """This task got a log line since the block opened."""

    name = "task-logged"

    def is_true(self, check: BlockCheck) -> bool:
        return check.container.get(Queries).query(TaskLog).filter(task_id=int(self.text)).matching(Greater("created_at", check.opened_at.text)).exists()

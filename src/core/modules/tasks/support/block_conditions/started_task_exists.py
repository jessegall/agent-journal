from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from core.modules.tasks.queries.task_query import TaskQuery


class StartedTaskExists(BlockCondition):
    """The agent holds a started task."""

    name = "task-in-hand"

    def is_true(self, check: BlockCheck) -> bool:
        return bool(check.container.get(TaskQuery).started_tasks(check.hook.agent_id))

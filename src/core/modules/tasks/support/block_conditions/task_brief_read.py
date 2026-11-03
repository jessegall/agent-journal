from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.queries import Queries
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_read import TaskRead


class TaskBriefRead(BlockCondition):
    """The agent read this task's brief in its current context window, or no longer holds the task."""

    name = "task-brief-read"

    def is_true(self, check: BlockCheck) -> bool:
        queries = check.container.get(Queries)
        task_id, agent_id = int(self.text), check.hook.agent_id
        return queries.query(Task).find(task_id).holder_id != agent_id or queries.query(TaskRead).filter(task_id=task_id, agent_id=agent_id).exists()

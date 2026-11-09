from collections.abc import Sequence

from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task_block_review import TaskBlockReview


class TaskBlocksReviewed(BlockCondition):
    """Every named task was renewed, unblocked, closed or given an automatic wait."""

    name = "task-blocks-reviewed"

    @classmethod
    def build(cls, tasks: Sequence[TaskBlockReview]) -> "TaskBlocksReviewed":
        return cls([value for task in tasks for value in (task.task_id, task.task_version)])

    def is_true(self, check: BlockCheck) -> bool:
        numbers = self.numbers
        tasks = check.container.get(Queries).query(TaskBlockReview).filter(session_agent_id=check.hook.agent_id).matching(Among("task_id", numbers[::2])).all_rows()
        return not self.pending(tuple(tasks))

    def pending(self, tasks: Sequence[TaskBlockReview]) -> bool:
        versions = dict(zip(self.numbers[::2], self.numbers[1::2]))
        return any(task.task_id in versions and task.state is TaskState.BLOCKED and not task.automatic
                   and task.block_version <= versions[task.task_id] for task in tasks)

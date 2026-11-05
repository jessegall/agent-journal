from core.base.driver.block_check import BlockCheck
from core.base.driver.block_condition import BlockCondition
from core.base.query.queries import Queries
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_read import TaskRead


class TaskBriefRead(BlockCondition):
    """The agent read this task's brief in its current context window, or it is not the task the agent works on."""

    name = "task-brief-read"
    subject_scoped = True

    def is_true(self, check: BlockCheck) -> bool:
        queries = check.container.get(Queries)
        task_id, agent_id = int(self.text), check.hook.agent_id
        current = queries.query(Task).filter(holder_id=agent_id, state=TaskState.STARTED).descending("started_at").limited(1)
        return not current or current[0].id != task_id or queries.query(TaskRead).filter(task_id=task_id, agent_id=agent_id).exists()

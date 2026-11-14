from engine.driver.block_check import BlockCheck
from engine.driver.block_condition import BlockCondition
from core.modules.tasks.rules.support.current_tasks import CurrentTasks


class TaskBriefRead(BlockCondition):
    """The agent read this task's brief in its current context window, or it is not the task the agent works on."""

    name = "task-brief-read"
    subject_scoped = True

    def is_true(self, check: BlockCheck) -> bool:
        tasks = check.container.get(CurrentTasks)
        task_id, agent_id = int(self.text), check.hook.agent_id
        current = tasks.started_tasks(agent_id)
        return not current or current[0].id != task_id or tasks.has_brief_read(task_id, agent_id)

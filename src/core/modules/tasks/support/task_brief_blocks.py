from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.block_until import BlockUntil
from core.modules.tasks.models.task import Task
from core.modules.tasks.rules.support.current_tasks import CurrentTasks
from core.modules.tasks.support.block_conditions.task_brief_read import TaskBriefRead
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from core.modules.tasks.support.task_nudges import TASK_BRIEF_FIRST


class TaskBriefBlocks:
    """Blocks an agent until it read the brief of a task it holds, unless it read it in this context window."""

    def __init__(self, bus: Bus, requirement: TaskBriefRequirement, tasks: CurrentTasks) -> None:
        self.bus, self.requirement, self.tasks = bus, requirement, tasks

    def block_current(self, agent_id: int, context: Context) -> None:
        for task in self.tasks.started_tasks(agent_id)[:1]:
            self.block_unread(agent_id, task, context)

    def block_unread(self, agent_id: int, task: Task, context: Context) -> None:
        if not self.requirement.is_required or self.tasks.has_brief_read(task.id, agent_id):
            return
        self.bus.dispatch(BlockUntil(agent_id, TASK_BRIEF_FIRST.nudge(task=task.id), TaskBriefRead(task.id)), context)

from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.driver.block_until import BlockUntil
from core.base.query.queries import Queries
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_read import TaskRead
from core.modules.tasks.support.block_conditions.task_brief_read import TaskBriefRead
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from core.modules.tasks.support.task_nudges import TASK_BRIEF_FIRST


class TaskBriefBlocks:
    """Blocks an agent until it read the brief of a task it holds, unless it read it in this context window."""

    def __init__(self, bus: Bus, queries: Queries, requirement: TaskBriefRequirement) -> None:
        self.bus, self.queries, self.requirement = bus, queries, requirement

    def block_unread(self, agent_id: int, task: Task, context: Context) -> None:
        if not self.requirement.is_required or self.queries.query(TaskRead).filter(task_id=task.id, agent_id=agent_id).exists():
            return
        nudge = TASK_BRIEF_FIRST.nudge(task=task.id)
        self.bus.dispatch(BlockUntil(agent_id, replace(nudge, key=f"{nudge.key}.{task.id}"), TaskBriefRead(task.id)), context)

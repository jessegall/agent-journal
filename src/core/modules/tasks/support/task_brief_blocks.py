from engine.command.bus import Bus
from engine.command.context import Context
from engine.driver.open_hold import OpenHold
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.current_tasks import CurrentTasks
from core.modules.tasks.support.block_conditions.task_brief_read import TaskBriefRead
from core.modules.tasks.support.task_brief_requirement import TaskBriefRequirement
from core.modules.tasks.agent_messages.task_brief_first_message import TaskBriefFirstMessage


class TaskBriefBlocks:
    """Blocks an agent until it read the brief of a task it holds, unless it read it in this context window."""

    def __init__(self, bus: Bus, requirement: TaskBriefRequirement, tasks: CurrentTasks) -> None:
        self.bus, self.requirement, self.tasks = bus, requirement, tasks

    def block_current(self, agent_id: int, context: Context) -> None:
        hold = self.current_hold(agent_id)
        if hold is not None:
            self.bus.dispatch(hold, context)

    def block_unread(self, agent_id: int, task: Task, context: Context) -> None:
        hold = self.unread_hold(agent_id, task)
        if hold is not None:
            self.bus.dispatch(hold, context)

    def current_hold(self, agent_id: int) -> OpenHold | None:
        started = self.tasks.started_tasks(agent_id)
        return self.unread_hold(agent_id, started[0]) if started else None

    def unread_hold(self, agent_id: int, task: Task) -> OpenHold | None:
        if not self.requirement.is_required or self.tasks.has_brief_read(task.id, agent_id):
            return None
        return OpenHold(agent_id, TaskBriefFirstMessage.declared().agent_message(task=task.id), TaskBriefRead(task.id))

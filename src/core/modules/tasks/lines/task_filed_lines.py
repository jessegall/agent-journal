from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.command_category import CommandCategory
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.current_tasks import CurrentTasks
from core.modules.tasks.nudges.task_filed_message import TaskFiledMessage
from core.modules.tasks.nudges.task_filed_keep_current_message import TaskFiledKeepCurrentMessage

TASK_COMMAND_START = ["task", "make"]


class TaskFiledLines(EventLineSource):
    """After an agent makes a task it is told to leave it open: the task is started by whoever the suite an
    environment runs has hand out tasks, if it has one."""

    key = "tasks.filed"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        tool = event.tool
        parts = tool.shell.parts if tool is not None and tool.shell is not None else ()
        if not any(part.classification.category is CommandCategory.JOURNAL and list(part.arguments[:2]) == TASK_COMMAND_START for part in parts):
            return []
        current = self.current_tasks.current(agent_id)
        return [TaskFiledKeepCurrentMessage.declared().nudge(task=current.task.id) if current is not None else TaskFiledMessage.declared().nudge()]

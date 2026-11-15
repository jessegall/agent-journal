from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.current_tasks import CurrentTasks
from core.modules.tasks.agent_messages.task_return_reminder_message import TaskReturnReminderMessage

LEAVING_COMMANDS = ("task close", "task cancel", "task block", "task release")


class StillHeldLines(EventLineSource):
    """An agent that lets go of a task while it holds others is sent back to the one it started last."""

    key = "tasks.still-held"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        shell = event.tool.shell if event.tool is not None else None
        if shell is None or not shell.parts_running_journal_command(*LEAVING_COMMANDS):
            return []
        current = self.current_tasks.current(agent_id)
        return [TaskReturnReminderMessage.declared().agent_message(task=current.task.id)] if current is not None else []

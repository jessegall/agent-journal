from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from core.modules.tasks.agent_messages.missed_log_message import MissedLogMessage
from core.modules.tasks.agent_messages.current_task_message import CurrentTaskMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.current_tasks import CurrentTasks
from engine.enums.agent_role import AgentRole


class SessionStartSummaryLines(EventLineSource):
    """A session that starts again with a task in hand, after a compaction, is told the task
    and its newest log line."""

    start_line = True
    key = "tasks.session-start-summary"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, current_tasks: CurrentTasks) -> None:
        self.current_tasks = current_tasks

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        current = self.current_tasks.current(agent_id)
        if current is None:
            return []
        return [CurrentTaskMessage.declared().agent_message(task=current.task.id), MissedLogMessage.declared().agent_message(task=current.task.id)]

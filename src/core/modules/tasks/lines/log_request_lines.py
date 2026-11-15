from collections.abc import Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.tasks.support.task_write_count import TaskWriteCount
from core.modules.tasks.support.task_agent_messages import LOG_REQUEST, LOG_REQUEST_WRITES


class LogRequestLines(EventLineSource):
    """The write that reaches 25 writes since the task in hand was last logged names the task back and asks for a
    log line."""

    key = "tasks.log-request"
    events = [HookEventName.PRE_TOOL_USE]
    role_group = RoleGroup.TASK

    def __init__(self, task_writes: TaskWriteCount) -> None:
        self.task_writes = task_writes

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        counted = self.task_writes.count(event, agent_id) if event is not None else None
        if counted is None or counted[1] != LOG_REQUEST_WRITES:
            return []
        return [LOG_REQUEST.agent_message(LOG_REQUEST_WRITES, task=counted[0].task.id)]

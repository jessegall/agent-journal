from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.policies.reading_policy import READ_POLICY_KEY
from core.modules.processes.support.reading.reading_enforcer import ReadingEnforcer


class ReadingLines(EventLineSource):
    """The lines that teach an agent to read its runs, and the reader a refused silent start is offered."""

    key = READ_POLICY_KEY
    events = [HookEventName.PRE_TOOL_USE]

    def __init__(self, enforcer: ReadingEnforcer) -> None:
        self.enforcer = enforcer

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        return self.enforcer.answer(event, agent_id).agent_messages if event is not None else []

from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from suites.coding.agent_messages.introduction_message import IntroductionMessage


class IntroductionLines(EventLineSource):
    """A main session the journal started, from its launcher, is told to introduce itself in the chat."""

    start_line = True
    key = "coding.introduction"
    events = [HookEventName.SESSION_START]
    agent_types = [AgentRole.MAIN.value]

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        if not event.launch:
            return []
        return [IntroductionMessage.declared().agent_message()]

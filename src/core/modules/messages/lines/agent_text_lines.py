from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.messages.support.agent_text.agent_text_answer import AgentTextAnswer

AGENT_TEXT_KEY = "messages.agent-text"


class AgentTextLines(EventLineSource):
    """The line about a finished text block of the main agent: a closing line kept out, a repeat, or a choice."""

    key = AGENT_TEXT_KEY
    events = [HookEventName.MESSAGE_DISPLAY]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, answer: AgentTextAnswer) -> None:
        self.answer = answer

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        agent_message = self.answer.shown(event, agent_id).agent_message if event is not None else None
        return [agent_message] if agent_message is not None else []

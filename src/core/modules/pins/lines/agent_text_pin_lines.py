from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.pins.support.link_pin_check import LinkPinCheck

AGENT_TEXT_PIN_KEY = "pins.agent-text-pin"


class AgentTextPinLines(EventLineSource):
    """Words in the text the main agent finished writing that a link is pinned are checked, and a link there that
    is not pinned is named."""

    key = AGENT_TEXT_PIN_KEY
    events = [HookEventName.MESSAGE_DISPLAY]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, check: LinkPinCheck) -> None:
        self.check = check

    def agent_messages(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        text = LinkPinCheck.finished_text(event)
        return self.check.agent_messages(text) if text is not None else []

from collections.abc import Sequence

from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.pins.lines.agent_text_pin_lines import AGENT_TEXT_PIN_KEY
from core.modules.pins.support.link_pin_check import LinkPinCheck


class AgentTextPinEffect(EventEffect):
    """A change request link in the text the main agent finished writing is pinned."""

    key = AGENT_TEXT_PIN_KEY
    events = [HookEventName.MESSAGE_DISPLAY]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, check: LinkPinCheck) -> None:
        self.check = check

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        text = LinkPinCheck.finished_text(event)
        return self.check.change_request_pins(text) if text is not None else []

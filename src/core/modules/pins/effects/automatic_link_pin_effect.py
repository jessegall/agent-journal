from engine.command.command import Command
from collections.abc import Sequence
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.enums.hook_event_name import HookEventName
from core.modules.pins.support.link_pin_check import LinkPinCheck


class AutomaticLinkPinEffect(EventEffect):
    """Pins pull request links returned by tools; a design link waits for its designer's report."""

    key = "pins.automatic-link"
    events = [HookEventName.POST_TOOL_USE]

    def __init__(self, check: LinkPinCheck) -> None:
        self.check = check

    def effect_commands(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        tool = event.tool
        if tool is None:
            return []
        if self.check.is_file_read_tool(tool):
            return []
        text = self.check.joined_text([event.tool_input(), event.raw.get("tool_response")])
        return [*self.check.change_request_pins(text)]

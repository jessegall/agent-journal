from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from core.modules.pins.support.link_pin_check import LinkPinCheck


class LinkPinLines(EventLineSource):
    """A link in a tool's output or in the line the agent ran is offered as a pin, and words in that line that a link
    is pinned are checked; a file the agent reads or edits is not offered from."""

    key = "pins.link-pin"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def __init__(self, check: LinkPinCheck) -> None:
        self.check = check

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        tool = event.tool
        if tool is None or self.check.is_file_read_tool(tool):
            return []
        part_nudges = [nudge for part_text in (tool.shell.part_texts if tool.shell is not None else ()) for nudge in self.check.nudges(part_text)]
        response = self.check.joined_text(event.raw.get("tool_response"))
        return [*part_nudges, *self.check.nudges("", response)]

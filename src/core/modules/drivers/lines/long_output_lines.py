from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.types.type_guards import is_mapping
from core.modules.drivers.nudges.long_output_message import LongOutputMessage

LONG_OUTPUT_LINE_COUNT = 400
TEXT_FIELDS = ("stdout", "content", "output")
RESPONSE_FILE_FIELD = "file"


class LongOutputLines(EventLineSource):
    """A tool's long result stays in the context for every later turn, so the main agent is told how long it
    was."""

    key = "drivers.long-output"
    events = [HookEventName.POST_TOOL_USE]
    agent_types = [AgentRole.MAIN.value]

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        lines = self.text(event.raw.get("tool_response")).count("\n")
        return [LongOutputMessage.declared().nudge(lines=lines)] if lines >= LONG_OUTPUT_LINE_COUNT else []

    @classmethod
    def text(cls, response: object) -> str:
        if isinstance(response, str):
            return response
        if not is_mapping(response):
            return ""
        if RESPONSE_FILE_FIELD in response:
            return cls.text(response[RESPONSE_FILE_FIELD])
        return next((text for text in (response[name] for name in TEXT_FIELDS if name in response) if isinstance(text, str)), "")

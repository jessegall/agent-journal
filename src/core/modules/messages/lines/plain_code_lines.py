from collections.abc import Sequence
from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource
from pathlib import PurePath

from engine.enums.hook_event_name import HookEventName
from core.modules.messages.nudges.plain_code_message import PlainCodeMessage

CODE_SUFFIXES = (".py", ".js", ".ts", ".vue", ".go", ".php")


class PlainCodeLines(EventLineSource):
    """An edit of a code file reminds the agent, every half hour, to write code in plain words."""

    key = "messages.plain-code"
    events = [HookEventName.PRE_TOOL_USE]

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[AgentMessage]:
        tool = event.tool
        if tool is None or not tool.is_writing_files() or not any(PurePath(path).suffix in CODE_SUFFIXES for path in tool.files):
            return []
        return [PlainCodeMessage.declared().nudge()]

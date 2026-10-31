from collections.abc import Mapping
from dataclasses import dataclass
from core.base.type_guards import is_mapping
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_fields import mapping, text
from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType
from server.hook.hook_headers import HookHeaders

RAW_BODY_VERSION = 0
TOOL_EVENTS = (HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE, HookEventName.POST_TOOL_USE_FAILURE)


@dataclass(frozen=True)
class RawHookBody:
    """A hook body that no Go program prepared, as an agent program sends it, read into the HookEvent it stands
    for through its program's hook names, with its tool unsplit and unclassified. Kept for one major
    version, while hooks still post raw bodies; removed at version 6."""

    hook_name: str
    session: str
    tool_name: str
    prompt: str
    subagent: str
    raw: Mapping[object, object]

    @classmethod
    def parsed(cls, data: object) -> "RawHookBody":
        fields = mapping(data, "a raw hook body")
        return cls(text(fields, "hook_event_name"), text(fields, "session_id"), text(fields, "tool_name"), text(fields, "prompt"), text(fields, "agent_id"), fields)

    def event(self, program: str, hook_events: Mapping[str, HookEventName], headers: HookHeaders) -> HookEvent:
        if self.hook_name not in hook_events:
            raise HookEventError(f"{program} sends no {self.hook_name!r} hook: its hooks are {', '.join(hook_events)}")
        event = hook_events[self.hook_name]
        tool = Tool(self.tool_name, ToolType.UNCATEGORISED, (), None, None) if event in TOOL_EVENTS else None
        prompt = self.prompt if event is HookEventName.PROMPT else None
        return HookEvent(RAW_BODY_VERSION, program, event, self.session, headers.firing, headers.hook_timestamp_ms, headers.actor,
                         headers.environment, self.subagent, tool, prompt, self.raw)


def is_raw_body(data: object) -> bool:
    return is_mapping(data) and "version" not in data

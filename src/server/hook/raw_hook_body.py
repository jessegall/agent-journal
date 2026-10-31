from collections.abc import Mapping
from dataclasses import dataclass
from core.base.type_guards import is_mapping
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_fields import mapping, text
from core.base.driver.tool import Tool
from server.hook.hook_headers import HookHeaders

RAW_BODY_VERSION = 0
EVENT_NAMES = {"PreToolUse": HookEventName.PRE_TOOL_USE, "PostToolUse": HookEventName.POST_TOOL_USE, "PostToolUseFailure": HookEventName.POST_TOOL_USE_FAILURE,
               "UserPromptSubmit": HookEventName.PROMPT, "Stop": HookEventName.STOP, "StopFailure": HookEventName.STOP_FAILURE,
               "SessionStart": HookEventName.SESSION_START, "SessionEnd": HookEventName.SESSION_END, "PreCompact": HookEventName.COMPACT,
               "SubagentStart": HookEventName.SESSION_START, "SubagentStop": HookEventName.STOP, "MessageDisplay": HookEventName.MESSAGE_DISPLAY}
TOOL_EVENTS = (HookEventName.PRE_TOOL_USE, HookEventName.POST_TOOL_USE, HookEventName.POST_TOOL_USE_FAILURE)


@dataclass(frozen=True)
class RawHookBody:
    """A hook body that no Go program prepared, as an agent program sends it, read into the HookEvent it stands
    for with its tool unsplit and unclassified. Kept for one major version, while hooks still post raw bodies;
    removed at version 6."""

    hook_name: str
    session: str
    tool_name: str
    prompt: str
    subagent: str
    raw: Mapping[object, object]

    @classmethod
    def parsed(cls, data: object) -> "RawHookBody":
        fields = mapping(data, "a raw hook body")
        hook_name = text(fields, "hook_event_name")
        if hook_name not in EVENT_NAMES:
            raise HookEventError(f"a raw hook body names its hook_event_name, one of {', '.join(EVENT_NAMES)}")
        return cls(hook_name, text(fields, "session_id"), text(fields, "tool_name"), text(fields, "prompt"), text(fields, "agent_id"), fields)

    def event(self, program: str, headers: HookHeaders) -> HookEvent:
        event = EVENT_NAMES[self.hook_name]
        tool = Tool(self.tool_name, "other", (), None, None) if event in TOOL_EVENTS else None
        prompt = self.prompt if event == "prompt" else None
        return HookEvent(RAW_BODY_VERSION, program, event, self.session, headers.firing, headers.hook_timestamp_ms, headers.actor,
                         headers.environment, self.subagent, tool, prompt, self.raw)


def is_raw_body(data: object) -> bool:
    return is_mapping(data) and "version" not in data

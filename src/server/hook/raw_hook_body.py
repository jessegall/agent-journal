from collections.abc import Mapping
from dataclasses import dataclass

from core.base.type_guards import is_mapping
from core.base.driver.hook_event import HookEvent, HookEventError, Tool, mapping, text

RAW_BODY_VERSION = 0
EVENT_NAMES = {"PreToolUse": "pre_tool_use", "PostToolUse": "post_tool_use", "PostToolUseFailure": "post_tool_use_failure",
               "UserPromptSubmit": "prompt", "Stop": "stop", "StopFailure": "stop_failure", "SessionStart": "session_start",
               "SessionEnd": "session_end", "PreCompact": "compact", "SubagentStart": "subagent_start", "SubagentStop": "subagent_stop",
               "MessageDisplay": "message_display"}
TOOL_EVENTS = ("pre_tool_use", "post_tool_use", "post_tool_use_failure")
HOOK_HEADERS = ("X-Journal-Hook-Id", "X-Journal-Request-At", "X-Journal-Actor", "X-Journal-Env")


@dataclass(frozen=True)
class HookHeaders:
    """What version 4's hook sends beside a raw body: its firing id, when it fired in milliseconds, its actor and
    its environment."""

    firing: str
    hook_timestamp_ms: int
    actor: str
    environment: str

    @classmethod
    def parsed(cls, headers: Mapping[str, str]) -> "HookHeaders":
        missing = [name for name in HOOK_HEADERS if name not in headers]
        if missing or not headers["X-Journal-Request-At"].isdigit():
            raise HookEventError(f"a raw hook body comes with the headers the hook sends: {', '.join(HOOK_HEADERS)}")
        return cls(headers["X-Journal-Hook-Id"], int(headers["X-Journal-Request-At"]), headers["X-Journal-Actor"], headers["X-Journal-Env"])


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

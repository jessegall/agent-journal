from collections.abc import Mapping
from dataclasses import dataclass

from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_event_version_error import HookEventVersionError
from core.base.driver.hook_fields import mapping, number, text
from core.base.driver.tool import Tool

HOOK_EVENT_VERSION = 1
REQUIRED_KEYS = ("version", "program", "event", "session", "firing", "fired_at_ms", "actor", "environment", "tool", "prompt", "raw")


@dataclass(frozen=True)
class HookEvent:
    """The object the Go hook program prepares from one hook of an agent program: who fired it and where, the
    tool or prompt it is about, and the raw body it came from."""

    version: int
    program: str
    event: str
    session: str
    firing: str
    hook_timestamp_ms: int
    actor: str
    environment: str
    subagent: str
    tool: Tool | None
    prompt: str | None
    raw: Mapping[object, object]

    @classmethod
    def tick(cls, program: str, session: str, firing: str, hook_timestamp_ms: int, actor: str, environment: str) -> "HookEvent":
        return cls(HOOK_EVENT_VERSION, program, HookEventName.TICK, session, firing, hook_timestamp_ms, actor, environment, "", None, None, {})

    @classmethod
    def parsed(cls, data: object) -> "HookEvent":
        fields = mapping(data, "a hook event")
        missing = [key for key in REQUIRED_KEYS if key not in fields]
        if missing:
            raise HookEventError(f"a hook event needs {', '.join(missing)}")
        version = fields.get("version")
        if version != HOOK_EVENT_VERSION:
            raise HookEventVersionError(f"the hook sent version {version!r} of the prepared object, and this server reads version {HOOK_EVENT_VERSION}")
        tool, prompt = fields.get("tool"), fields.get("prompt")
        if prompt is not None and not isinstance(prompt, str):
            raise HookEventError(f"prompt is a text, not {prompt!r}")
        return cls(HOOK_EVENT_VERSION, text(fields, "program"), text(fields, "event"), text(fields, "session"), text(fields, "firing"),
                   number(fields, "fired_at_ms"), text(fields, "actor"), text(fields, "environment"), text(fields, "subagent"),
                   Tool.parsed(tool) if tool is not None else None, prompt, mapping(fields.get("raw", {}), "raw"))

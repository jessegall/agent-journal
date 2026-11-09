from collections.abc import Mapping
from dataclasses import dataclass

from core.base.agent_role import AgentRole
from core.base.driver.foreign_run import ForeignRun
from core.base.driver.hook_event_error import HookEventError
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_event_version_error import HookEventVersionError
from core.base.driver.old_hook_runner_error import OldHookRunnerError
from core.base.driver.hook_fields import boolean, mapping, mappings, number, text
from core.base.driver.hook_transcript import HookTranscript
from core.base.driver.tool import Tool
from core.base.driver.tool_type import ToolType

HOOK_EVENT_VERSION = 3
RESUME_SOURCE = "resume"
COMPACTION_SOURCE = "compact"
MANUAL_TRIGGER = "manual"
CLEAR_SOURCE = "clear"
CLEAR_REASON = "clear"
CONTINUING_SOURCES = (COMPACTION_SOURCE, CLEAR_SOURCE)
REQUIRED_KEYS = ("version", "program", "event", "session", "firing", "fired_at_ms", "actor", "environment", "tool", "prompt", "raw", "accepts_lines", "launch", "foreign")


@dataclass(frozen=True)
class HookEvent:
    """The object the Go hook program prepares from one hook of an agent program: who fired it and where, the
    tool or prompt it is about, and the raw body it came from."""

    version: int
    program: str
    event: HookEventName
    session: str
    firing: str
    hook_timestamp_ms: int
    actor: str
    environment: str
    tool: Tool | None
    prompt: str | None
    raw: Mapping[object, object]
    accepts_lines: bool = False
    launch: str = ""
    foreign: tuple[ForeignRun, ...] = ()
    child_agent: str = ""
    role: str = ""

    @classmethod
    def tick(cls, program: str, session: str, firing: str, hook_timestamp_ms: int, actor: str, environment: str) -> "HookEvent":
        return cls(HOOK_EVENT_VERSION, program, HookEventName.TICK, session, firing, hook_timestamp_ms, actor, environment, None, None, {})

    @classmethod
    def parsed(cls, data: object) -> "HookEvent":
        fields = mapping(data, "a hook event")
        version = fields.get("version")
        if version != HOOK_EVENT_VERSION:
            raise HookEventVersionError(f"the hook sent version {version!r} of the prepared object, and this server reads version {HOOK_EVENT_VERSION}")
        missing = [key for key in REQUIRED_KEYS if key not in fields]
        if missing:
            raise HookEventError(f"a hook event needs {', '.join(missing)}")
        tool, prompt, event = fields.get("tool"), fields.get("prompt"), text(fields, "event")
        accepts_lines = boolean(fields, "accepts_lines")
        if event not in HookEventName:
            raise HookEventError(f"{event!r} names no hook event: {', '.join(HookEventName)}")
        if prompt is not None and not isinstance(prompt, str):
            raise HookEventError(f"prompt is a text, not {prompt!r}")
        if any("answer" not in run for run in mappings(fields["foreign"], "a foreign hook run")):
            raise OldHookRunnerError.detected()
        return cls(HOOK_EVENT_VERSION, text(fields, "program"), HookEventName(event), text(fields, "session"), text(fields, "firing"),
                   number(fields, "fired_at_ms"), text(fields, "actor"), text(fields, "environment"),
                   Tool.parsed(tool) if tool is not None else None, prompt, mapping(fields.get("raw", {}), "raw"), accepts_lines,
                   text(fields, "launch"), ForeignRun.parsed_many(fields["foreign"]), str(fields.get("child_agent", "")), str(fields.get("role", "")))

    @property
    def transcript(self) -> HookTranscript:
        path = self.raw.get("transcript_path")
        return HookTranscript(self.program, self.firing, path if isinstance(path, str) else "")

    @property
    def is_resume(self) -> bool:
        return self.raw.get("source") == RESUME_SOURCE

    @property
    def is_compaction_start(self) -> bool:
        return self.raw.get("source") == COMPACTION_SOURCE

    @property
    def is_manual_compaction(self) -> bool:
        return self.event is HookEventName.COMPACT and self.raw.get("trigger") == MANUAL_TRIGGER

    @property
    def is_clear_start(self) -> bool:
        return self.event is HookEventName.SESSION_START and self.raw.get("source") == CLEAR_SOURCE

    @property
    def is_launch_clear_end(self) -> bool:
        return self.event is HookEventName.SESSION_END and self.raw.get("reason") == CLEAR_REASON and bool(self.launch)

    @property
    def is_check_required(self) -> bool:
        return self.requires_check(self.event, self.role)

    @staticmethod
    def requires_check(event: HookEventName | None, role: str) -> bool:
        return event is HookEventName.PRE_TOOL_USE and role not in ("", AgentRole.MAIN)

    @property
    def is_interrupt(self) -> bool:
        return self.event is HookEventName.POST_TOOL_USE_FAILURE and self.raw.get("is_interrupt") is True

    @property
    def is_continuing(self) -> bool:
        return self.raw.get("source") in CONTINUING_SOURCES

    @property
    def displayed_text(self) -> str:
        text = self.raw.get("delta")
        return text.strip() if self.raw.get("final") is True and isinstance(text, str) else ""

    def is_monitor_tool(self) -> bool:
        return self.tool is not None and self.tool.category is ToolType.MONITOR

    def tool_input(self) -> Mapping[object, object]:
        return mapping(self.raw.get("tool_input", {}), "tool_input")

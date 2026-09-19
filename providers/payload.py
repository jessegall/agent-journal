from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class ToolUse:
    name: str = ""
    command: str = ""
    file_path: str = ""
    subagent_type: str = ""
    model: str = ""
    task_name: str = ""
    response: dict = field(default_factory=dict)

    @classmethod
    def read(cls, raw: dict) -> "ToolUse":
        given = raw.get("tool_input") or {}
        response = raw.get("tool_response")
        return cls(name=str(raw.get("tool_name") or ""), command=str(given.get("command") or ""), file_path=str(given.get("file_path") or ""),
                   subagent_type=str(given.get("subagent_type") or ""), model=str(given.get("model") or ""), task_name=str(given.get("task_name") or ""),
                   response=response if isinstance(response, dict) else {})


@dataclass(frozen=True)
class Hook:
    event: str = ""
    session: str = ""
    transcript: Path | None = None
    cwd: str = ""
    model: str = ""
    source: str = ""
    tool: ToolUse = field(default_factory=ToolUse)

    @classmethod
    def read(cls, raw: dict) -> "Hook":
        transcript = str(raw.get("transcript_path") or "")
        return cls(event=str(raw.get("hook_event_name") or ""), session=Path(transcript or str(raw.get("session_id") or "")).stem,
                   transcript=Path(transcript) if transcript else None, cwd=str(raw.get("cwd") or ""), model=str(raw.get("model") or ""),
                   source=str(raw.get("source") or ""), tool=ToolUse.read(raw))

    @property
    def command(self) -> str:
        return self.tool.command

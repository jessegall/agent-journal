import json
from dataclasses import dataclass, field
from pathlib import Path

STATUS = {"SessionStart": "idle", "Stop": "idle", "UserPromptSubmit": "working", "PreToolUse": "working",
          "PostToolUse": "working", "PreCompact": "compacting", "SubagentStart": "",
          "SubagentStop": "", "SessionEnd": "stopped", "PermissionRequest": ""}
PERMISSION = "PermissionRequest"
DISPLAYED = "MessageDisplay"
EVENTS = tuple(STATUS)


@dataclass(frozen=True)
class AskedQuestion:
    text: str
    options: list[dict]


@dataclass(frozen=True)
class ToolUse:
    name: str = ""
    command: str = ""
    file_path: str = ""
    subagent_type: str = ""
    model: str = ""
    task_name: str = ""
    pattern: str = ""
    url: str = ""
    skill: str = ""
    written: str = ""
    response: dict = field(default_factory=dict)
    tool_input: dict = field(default_factory=dict)

    @classmethod
    def read(cls, raw: dict) -> "ToolUse":
        given = raw.get("tool_input") or {}
        response = raw.get("tool_response")
        return cls(name=str(raw.get("tool_name") or ""), command=str(given.get("command") or ""), file_path=str(given.get("file_path") or ""),
                   subagent_type=str(given.get("subagent_type") or ""), model=str(given.get("model") or ""), task_name=str(given.get("task_name") or ""),
                   pattern=str(given.get("pattern") or given.get("query") or ""), url=str(given.get("url") or ""), skill=str(given.get("skill") or ""),
                   written=str(given.get("content") or given.get("new_string") or given.get("prompt") or ""),
                   response=response if isinstance(response, dict) else {}, tool_input=given if isinstance(given, dict) else {})

    @property
    def loads_skill(self) -> bool:
        return self.name == "Skill"

    @property
    def plans(self) -> bool:
        return self.name == "EnterPlanMode"

    @property
    def result_size(self) -> int:
        return len(json.dumps(self.response)) if self.response and self.response.get("type") != "image" else 0

    @property
    def text(self) -> str:
        return " ".join(part for part in (self.command, self.file_path, self.pattern, self.url, self.skill, self.subagent_type, self.task_name, self.written) if part)

    @property
    def doing(self) -> str:
        name = Path(self.file_path).name
        if self.name == "Bash":
            return self.command
        if self.name == "Read":
            return f"reading {name}"
        if self.name in ("Edit", "MultiEdit", "NotebookEdit"):
            return f"editing {name}"
        if self.name == "Write":
            return f"writing {name}"
        if self.name in ("Glob", "Grep"):
            return f"searching {self.pattern}".strip()
        if self.name == "WebFetch":
            return f"fetching {self.url.split('/')[2] if self.url.count('/') > 2 else self.url}".strip()
        if self.name == "WebSearch":
            return f"searching the web for {self.pattern}".strip()
        if self.name in ("Agent", "Task"):
            return f"dispatching {self.subagent_type or self.task_name or 'an agent'}"
        if self.name == "Skill":
            return f"loading skill {self.skill}".strip()
        if self.name.startswith("mcp__"):
            server, _, tool = self.name[5:].partition("__")
            return f"{server} · {tool.replace('_', ' ')}"
        return self.name.lower()

    @property
    def subject(self) -> str:
        if self.name == "Bash":
            return ""
        if self.file_path:
            return Path(self.file_path).name
        if self.name.startswith("mcp__"):
            server, _, tool = self.name[5:].partition("__")
            return f"{server} · {tool.replace('_', ' ')}"
        if self.url:
            return self.url.split("/")[2] if self.url.count("/") > 2 else self.url
        return self.pattern or self.skill or self.subagent_type or self.task_name


@dataclass(frozen=True)
class Hook:
    event: str = ""
    session: str = ""
    transcript: Path | None = None
    cwd: str = ""
    model: str = ""
    source: str = ""
    inbox: str = ""
    last_message: str = ""
    tool: ToolUse = field(default_factory=ToolUse)

    @classmethod
    def read(cls, raw: dict) -> "Hook":
        transcript = str(raw.get("transcript_path") or "")
        return cls(event=str(raw.get("hook_event_name") or ""), session=Path(transcript or str(raw.get("session_id") or "")).stem,
                   transcript=Path(transcript) if transcript else None, cwd=str(raw.get("cwd") or ""), model=str(raw.get("model") or ""),
                   source=str(raw.get("source") or ""), inbox=str(raw.get("inbox") or ""),
                   last_message=str(raw.get("last_assistant_message") or ""), tool=ToolUse.read(raw))

    @property
    def command(self) -> str:
        return self.tool.command

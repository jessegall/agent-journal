import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from engine.fields import list_of, mapping_of, number_of, text_of

STATUS = {"SessionStart": "idle", "Stop": "idle", "UserPromptSubmit": "working", "PreToolUse": "working",
          "PostToolUse": "working", "PreCompact": "compacting", "SubagentStart": "",
          "SubagentStop": "", "SessionEnd": "stopped", "PermissionRequest": ""}
PERMISSION = "PermissionRequest"
DISPLAYED = "MessageDisplay"
EVENTS = tuple(STATUS)


SKILL_READ = re.compile(r"(?:^|[\s'\"/=(])(?:\.(?:codex|agents|claude)/)?skills/(journal(?:-[\w-]+)?)/SKILL\.md")


@dataclass(frozen=True)
class AskedQuestion:
    text: str
    options: list[dict]
    labels: tuple = ()

    @classmethod
    def from_payload(cls, raw: dict) -> "AskedQuestion":
        given = [option for option in list_of(raw, "options") if isinstance(option, dict) and text_of(option, "label")]
        labels = tuple(text_of(option, "label") for option in given)
        return cls(text_of(raw, "question").strip(), [{"title": label, "description": text_of(option, "description")} for label, option in zip(labels, given)], labels)


def asked_in(given: dict) -> tuple[AskedQuestion, ...]:
    found = (AskedQuestion.from_payload(q) for q in list_of(given, "questions") if isinstance(q, dict))
    return tuple(question for question in found if question.text)


@dataclass(frozen=True)
class Asking:
    tool: str = ""
    call: str = ""
    at: float = 0.0

    @classmethod
    def from_json(cls, raw) -> "Asking | None":
        if not isinstance(raw, dict) or not raw:
            return None
        return cls(text_of(raw, "tool"), text_of(raw, "call"), number_of(raw, "at"))


@dataclass(frozen=True)
class UsageWindow:
    key: str
    label: str
    used: float
    minutes: int
    resets: int

    def to_json(self) -> dict:
        return {"key": self.key, "label": self.label, "used": round(max(0, min(100, self.used)), 1), "minutes": self.minutes, "resets": self.resets}


@dataclass(frozen=True)
class Dispatch:
    kind: str
    model: str
    model_supported: bool
    task: str = ""


@dataclass(frozen=True)
class ToolCall:
    id: str
    name: str
    at: float
    skill: str = ""
    command: str = ""
    description: str = ""
    subagent_type: str = ""
    model: str = ""
    task: str = ""
    background: bool = False
    timeout_ms: float = 0.0
    url: str = ""
    to: str = ""
    message: str = ""
    questions: tuple = ()

    @classmethod
    def of(cls, id: str, name: str, at: float, given: dict) -> "ToolCall":
        return cls(id=id, name=name, at=at, skill=text_of(given, "skill"), command=text_of(given, "command"), description=text_of(given, "description"),
                   subagent_type=text_of(given, "subagent_type"), model=text_of(given, "model"), task=text_of(given, "task_id", "shell_id"),
                   background=bool(given.get("run_in_background")), timeout_ms=number_of(given, "timeout_ms"), url=text_of(mapping_of(given, "ws"), "url"),
                   to=text_of(given, "to"), message=text_of(given, "message"), questions=asked_in(given))


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
    agent_type: str = ""
    stdout: str = ""
    stderr: str = ""
    response: dict = field(default_factory=dict)
    tool_input: dict = field(default_factory=dict)

    @classmethod
    def read(cls, raw: dict) -> "ToolUse":
        given = mapping_of(raw, "tool_input")
        return cls(name=text_of(raw, "tool_name"), command=text_of(given, "command"), file_path=text_of(given, "file_path"),
                   subagent_type=text_of(given, "subagent_type"), model=text_of(given, "model"), task_name=text_of(given, "task_name"),
                   pattern=text_of(given, "pattern", "query"), url=text_of(given, "url"), skill=text_of(given, "skill"),
                   written=text_of(given, "content", "new_string", "prompt"), agent_type=text_of(given, "agent_type"),
                   stdout=text_of(mapping_of(raw, "tool_response"), "stdout"), stderr=text_of(mapping_of(raw, "tool_response"), "stderr"),
                   response=mapping_of(raw, "tool_response"), tool_input=given)

    @property
    def loaded_skill(self) -> str:
        if self.name == "Skill":
            return self.skill
        found = SKILL_READ.search(json.dumps(self.tool_input))
        return found.group(1) if found else ""

    @property
    def loads_skill(self) -> bool:
        return bool(self.loaded_skill)

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
    agent: str = ""
    tool: ToolUse = field(default_factory=ToolUse)

    @classmethod
    def read(cls, raw: dict) -> "Hook":
        transcript = text_of(raw, "transcript_path")
        return cls(event=text_of(raw, "hook_event_name"), session=Path(text_of(raw, "transcript_path", "session_id")).stem,
                   transcript=Path(transcript) if transcript else None, cwd=text_of(raw, "cwd"), model=text_of(raw, "model"),
                   source=text_of(raw, "source"), inbox=text_of(raw, "inbox"),
                   last_message=text_of(raw, "last_assistant_message"), agent=text_of(raw, "agent_id"), tool=ToolUse.read(raw))

    @property
    def command(self) -> str:
        return self.tool.command

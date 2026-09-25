import json
import re
from dataclasses import dataclass, field, replace
from typing import ClassVar
from pathlib import Path

from engine.fields import Loaded

STATUS = {"SessionStart": "idle", "Stop": "idle", "UserPromptSubmit": "working", "PreToolUse": "working",
          "PostToolUse": "working", "PreCompact": "compacting", "SubagentStart": "",
          "SubagentStop": "", "SessionEnd": "stopped", "PermissionRequest": ""}
PERMISSION = "PermissionRequest"
DISPLAYED = "MessageDisplay"
EVENTS = tuple(STATUS)




OUTPUT_KEYS = ("stdout", "stderr", "content", "result", "text", "output")
SKILL_READ = re.compile(r"(?:^|[\s'\"/=(])(?:\.(?:codex|agents|claude)/)?skills/(journal(?:-[\w-]+)?)/SKILL\.md")


@dataclass(frozen=True)
class AskedOption(Loaded):
    label: str = ""
    description: str = ""


@dataclass(frozen=True)
class AskedQuestion(Loaded):
    aliases = {"choices": ("options",)}
    question: str = ""
    choices: tuple[AskedOption, ...] = ()

    @property
    def text(self) -> str:
        return self.question.strip()

    @property
    def labels(self) -> tuple:
        return tuple(choice.label for choice in self.choices if choice.label)

    @property
    def options(self) -> list[dict]:
        return [{"title": choice.label, "description": choice.description} for choice in self.choices if choice.label]


@dataclass(frozen=True)
class Asking(Loaded):
    tool: str = ""
    call: str = ""
    at: float = 0.0

    @classmethod
    def of(cls, raw) -> "Asking | None":
        return cls.from_json(raw) if isinstance(raw, dict) and raw else None


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
    description: str = ""
    name_supported: bool = False


@dataclass(frozen=True)
class Socket(Loaded):
    url: str = ""


@dataclass(frozen=True)
class ToolCall(Loaded):
    aliases = {"task": ("task_id", "shell_id"), "background": ("run_in_background",)}
    id: str = ""
    name: str = ""
    at: float = 0.0
    skill: str = ""
    command: str = ""
    description: str = ""
    subagent_type: str = ""
    model: str = ""
    task: str = ""
    background: bool = False
    timeout_ms: float = 0.0
    ws: Socket = Socket()
    to: str = ""
    message: str = ""
    questions: tuple[AskedQuestion, ...] = ()

    @classmethod
    def from_payload(cls, id: str, name: str, at: float, given: dict) -> "ToolCall":
        return replace(cls.from_json(given), id=id, name=name, at=at)

    @property
    def url(self) -> str:
        return self.ws.url

    @property
    def skill_loaded(self) -> str:
        return self.skill if self.name == "Skill" else ""


LOOP_ID = re.compile(r"\b([0-9a-f]{8})\b")


def response_text(response) -> str:
    if isinstance(response, str):
        return response
    if isinstance(response, list):
        return "\n".join(text for part in response if (text := response_text(part)))
    if not isinstance(response, dict):
        return ""
    if "file" in response:
        return response_text(response["file"])
    if response.get("filenames") and not response.get("content"):
        return "\n".join(response["filenames"])
    return "\n".join(text for key in OUTPUT_KEYS if (text := response_text(response.get(key))))


@dataclass(frozen=True)
class ToolUse(Loaded):
    needs: ClassVar[tuple] = ()
    name: str = ""
    tool_input: dict = field(default_factory=dict)
    response: dict = field(default_factory=dict)

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "ToolUse":
        call = replace(cls.from_json(given), name=name, tool_input=given, response=response)
        missing = [field for field in cls.needs if not getattr(call, field)]
        if missing:
            raise KeyError(f"{name} carries no {', '.join(missing)}")
        return call

    @property
    def paths(self) -> tuple:
        return ()

    @property
    def words(self) -> tuple:
        return ()

    @property
    def commands(self) -> tuple:
        return ()

    @property
    def writings(self) -> tuple:
        return ()

    @property
    def text(self) -> str:
        return " ".join(word for word in self.words if word)

    @property
    def server_tool(self) -> tuple[str, str] | None:
        if not self.name.startswith("mcp__"):
            return None
        server, _, tool = self.name[5:].partition("__")
        return server, tool.replace("_", " ")

    @property
    def doing(self) -> str:
        found = self.server_tool
        return f"{found[0]} · {found[1]}" if found else self.name.lower()

    @property
    def subject(self) -> str:
        found = self.server_tool
        return f"{found[0]} · {found[1]}" if found else ""

    @property
    def loaded_skill(self) -> str | None:
        found = SKILL_READ.search(json.dumps(self.tool_input))
        return found.group(1) if found else None

    @property
    def loads_skill(self) -> bool:
        return self.loaded_skill is not None

    @property
    def plans(self) -> bool:
        return self.name == "EnterPlanMode"

    @property
    def result_size(self) -> int:
        return len(json.dumps(self.response)) if self.response and self.response.get("type") != "image" else 0

    @property
    def output(self) -> str:
        return response_text(self.response)


@dataclass(frozen=True)
class BashCall(ToolUse):
    command: str = ""
    printed: str = ""

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "BashCall":
        printed = "\n".join(str(response[key]) for key in ("stdout", "stderr") if response.get(key))
        return cls(name, given, response, command=given["command"], printed=printed)

    @property
    def words(self) -> tuple:
        return (self.command,)

    @property
    def commands(self) -> tuple:
        return (self.command,)

    @property
    def doing(self) -> str:
        return self.command

    @property
    def subject(self) -> str:
        return ""


@dataclass(frozen=True)
class FileCall(ToolUse):
    file_path: str = ""

    @property
    def paths(self) -> tuple:
        return (self.file_path,)

    @property
    def words(self) -> tuple:
        return (self.file_path,)

    @property
    def subject(self) -> str:
        return Path(self.file_path).name


@dataclass(frozen=True)
class ReadCall(FileCall):
    whole: bool = True

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "ReadCall":
        return cls(name, given, response, file_path=given["file_path"], whole="offset" not in given and "limit" not in given)

    @property
    def doing(self) -> str:
        return f"reading {self.subject}"


@dataclass(frozen=True)
class WriteCall(FileCall):
    aliases = {"file_path": ("file_path", "notebook_path"), "written": ("content", "new_string", "new_source")}
    needs = ("file_path",)
    written: str = ""

    @property
    def words(self) -> tuple:
        return (self.file_path, self.written)

    @property
    def output(self) -> str:
        return ""

    @property
    def writings(self) -> tuple:
        return (self.written,)

    @property
    def doing(self) -> str:
        return f"{'writing' if self.name == 'Write' else 'editing'} {self.subject}"


@dataclass(frozen=True)
class SearchCall(ToolUse):
    pattern: str = ""
    web: bool = False

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "SearchCall":
        web = "query" in given
        return cls(name, given, response, pattern=given["query"] if web else given["pattern"], web=web)

    @property
    def words(self) -> tuple:
        return (self.pattern,)

    @property
    def doing(self) -> str:
        return f"searching the web for {self.pattern}" if self.web else f"searching {self.pattern}"

    @property
    def subject(self) -> str:
        return self.pattern


@dataclass(frozen=True)
class FetchCall(ToolUse):
    url: str = ""

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "FetchCall":
        return cls(name, given, response, url=given["url"])

    @property
    def host(self) -> str:
        return self.url.split("/")[2] if self.url.count("/") > 2 else self.url

    @property
    def words(self) -> tuple:
        return (self.url,)

    @property
    def doing(self) -> str:
        return f"fetching {self.host}"

    @property
    def subject(self) -> str:
        return self.host


@dataclass(frozen=True)
class LoopCall(ToolUse):
    aliases = {"schedule": ("cron", "schedule"), "prompt": ("prompt",)}
    schedule: str = ""
    prompt: str = ""

    @property
    def loop(self) -> str:
        given = self.response.get("id") or self.response.get("job_id") if isinstance(self.response, dict) else ""
        found = LOOP_ID.search(response_text(self.response))
        return str(given) if given else found[1] if found else ""


@dataclass(frozen=True)
class LoopEndCall(ToolUse):
    aliases = {"loop": ("id", "job_id")}
    loop: str = ""


@dataclass(frozen=True)
class SkillCall(ToolUse):
    skill: str = ""

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "SkillCall":
        return cls(name, given, response, skill=given["skill"])

    @property
    def words(self) -> tuple:
        return (self.skill,)

    @property
    def doing(self) -> str:
        return f"loading skill {self.skill}"

    @property
    def subject(self) -> str:
        return self.skill

    @property
    def loaded_skill(self) -> str | None:
        return self.skill


@dataclass(frozen=True)
class AgentCall(ToolUse):
    aliases = {"kind": ("subagent_type", "agent_type"), "task": ("task_name", "description"), "prompt": ("prompt", "message")}
    kind: str = ""
    model: str = ""
    task: str = ""
    prompt: str = ""

    @property
    def words(self) -> tuple:
        return (self.kind, self.task, self.prompt)

    @property
    def writings(self) -> tuple:
        return (self.prompt,)

    @property
    def named(self) -> str:
        return self.kind if self.kind else self.task

    @property
    def doing(self) -> str:
        return f"dispatching {self.named if self.named else 'an agent'}"

    @property
    def subject(self) -> str:
        return self.named


@dataclass(frozen=True)
class AskCall(ToolUse):
    questions: tuple[AskedQuestion, ...] = ()

    @property
    def words(self) -> tuple:
        return tuple(question.text for question in self.questions)


@dataclass(frozen=True)
class Called(Loaded):
    tool_name: str = ""
    tool_input: dict = field(default_factory=dict)
    tool_response: dict = field(default_factory=dict)


def call_of(raw: dict, kinds: dict) -> ToolUse:
    called = Called.from_json(raw)
    name, given, response = called.tool_name, called.tool_input, called.tool_response
    kind = kinds.get(name.rsplit(".", 1)[-1])
    try:
        return kind.from_payload(name, given, response) if kind else ToolUse(name, given, response)
    except (KeyError, TypeError, ValueError):
        return ToolUse(name, given, response)



@dataclass(frozen=True)
class Hook(Loaded):
    aliases = {"event": ("hook_event_name",), "session": ("session_id",), "transcript": ("transcript_path",),
               "last_message": ("last_assistant_message",), "agent": ("agent_id",)}
    agent_type: str = ""
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
    def read(cls, raw: dict, kinds: dict) -> "Hook":
        hook = cls.from_json(raw)
        return replace(hook, session=hook.transcript.stem if hook.transcript else hook.session, tool=call_of(raw, kinds))

    @property
    def shell(self) -> str | None:
        return self.tool.command if isinstance(self.tool, BashCall) else None

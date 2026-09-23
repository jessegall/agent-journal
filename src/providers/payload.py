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
    tool_input: dict = field(default_factory=dict)
    response: dict = field(default_factory=dict)

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
    written: str = ""

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "WriteCall":
        path = given["file_path"] if "file_path" in given else given["notebook_path"]
        return cls(name, given, response, file_path=path, written=text_of(given, "content", "new_string", "new_source"))

    @property
    def words(self) -> tuple:
        return (self.file_path, self.written)

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
    kind: str = ""
    model: str = ""
    task: str = ""
    prompt: str = ""

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "AgentCall":
        return cls(name, given, response, kind=text_of(given, "subagent_type", "agent_type"), model=text_of(given, "model"),
                   task=text_of(given, "task_name", "description"), prompt=text_of(given, "prompt", "message"))

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
    questions: tuple = ()

    @classmethod
    def from_payload(cls, name: str, given: dict, response: dict) -> "AskCall":
        return cls(name, given, response, questions=asked_in(given))

    @property
    def words(self) -> tuple:
        return tuple(question.text for question in self.questions)


def call_of(raw: dict, kinds: dict) -> ToolUse:
    name, given, response = text_of(raw, "tool_name"), mapping_of(raw, "tool_input"), mapping_of(raw, "tool_response")
    kind = kinds.get(name.rsplit(".", 1)[-1])
    try:
        return kind.from_payload(name, given, response) if kind else ToolUse(name, given, response)
    except (KeyError, TypeError, ValueError):
        return ToolUse(name, given, response)



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
    def read(cls, raw: dict, kinds: dict) -> "Hook":
        transcript = text_of(raw, "transcript_path")
        return cls(event=text_of(raw, "hook_event_name"), session=Path(text_of(raw, "transcript_path", "session_id")).stem,
                   transcript=Path(transcript) if transcript else None, cwd=text_of(raw, "cwd"), model=text_of(raw, "model"),
                   source=text_of(raw, "source"), inbox=text_of(raw, "inbox"),
                   last_message=text_of(raw, "last_assistant_message"), agent=text_of(raw, "agent_id"), tool=call_of(raw, kinds))

    @property
    def shell(self) -> str | None:
        return self.tool.command if isinstance(self.tool, BashCall) else None

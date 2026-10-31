from collections.abc import Mapping
from dataclasses import dataclass

from core.base.type_guards import is_list, is_mapping

HOOK_EVENT_VERSION = 1
REQUIRED_KEYS = ("version", "program", "event", "session", "firing", "fired_at_ms", "actor", "environment", "tool", "prompt", "raw")


class HookEventError(Exception):
    """Raised when a hook's body is not a prepared object of the shape the schema gives."""


class HookEventVersionError(HookEventError):
    """Raised when a hook's body was prepared for a version of the object this server does not read."""


def text(data: Mapping[object, object], key: str) -> str:
    value = data.get(key, "")
    if not isinstance(value, str):
        raise HookEventError(f"{key} is a text, not {value!r}")
    return value


def number(data: Mapping[object, object], key: str) -> int:
    value = data.get(key, 0)
    if not isinstance(value, int) or isinstance(value, bool):
        raise HookEventError(f"{key} is a whole number, not {value!r}")
    return value


def texts(data: Mapping[object, object], key: str) -> tuple[str, ...]:
    value = data.get(key, [])
    if not is_list(value) or not all(isinstance(item, str) for item in value):
        raise HookEventError(f"{key} is a list of texts, not {value!r}")
    return tuple(str(item) for item in value)


def mapping(value: object, name: str) -> Mapping[object, object]:
    if not is_mapping(value):
        raise HookEventError(f"{name} is an object, not {value!r}")
    return value


@dataclass(frozen=True)
class Classification:
    """What a shell part is and does: its category, as the command table names it, and its effects."""

    category: str
    effects: tuple[str, ...]

    @classmethod
    def parsed(cls, data: object) -> "Classification":
        fields = mapping(data, "classification")
        return cls(text(fields, "kind"), texts(fields, "effects"))


@dataclass(frozen=True)
class Part:
    """One command of a shell line: its text, program, subcommand and arguments, how it is classified, the paths it
    reads and writes, and how it joins the next."""

    text: str
    program: str
    subcommand: str
    arguments: tuple[str, ...]
    classification: Classification
    input_paths: tuple[str, ...]
    output_paths: tuple[str, ...]
    next_operator: str
    pipe_target: int | None

    @classmethod
    def parsed(cls, data: object) -> "Part":
        fields = mapping(data, "part")
        pipe_target = fields.get("piped_into")
        if pipe_target is not None and not isinstance(pipe_target, int):
            raise HookEventError(f"piped_into is a part's number, not {pipe_target!r}")
        return cls(text(fields, "text"), text(fields, "program"), text(fields, "subcommand"), texts(fields, "arguments"),
                   Classification.parsed(fields.get("classification")), texts(fields, "read_paths"), texts(fields, "write_paths"),
                   text(fields, "joined_by"), pipe_target)


@dataclass(frozen=True)
class ShellLine:
    """A shell tool's line split into its parts, with its redirects, the category of its weightiest part, whether
    it runs only journal commands, and the parse error of a line no shell reads."""

    line: str
    parts: tuple[Part, ...]
    redirects: tuple[str, ...]
    category: str
    is_journal_line: bool
    parse_error: str

    @classmethod
    def parsed(cls, data: object) -> "ShellLine":
        fields = mapping(data, "shell")
        parts = fields.get("parts", [])
        if not is_list(parts):
            raise HookEventError("parts is a list")
        return cls(text(fields, "line"), tuple(Part.parsed(part) for part in parts), texts(fields, "redirects"), text(fields, "kind"),
                   fields.get("is_journal_only") is True, text(fields, "parse_error"))


@dataclass(frozen=True)
class DiffCount:
    """The lines an edit or a write adds and removes in one file, and whether the file existed before."""

    path: str
    existed: bool
    lines_added: int
    lines_removed: int

    @classmethod
    def parsed(cls, data: object) -> "DiffCount":
        fields = mapping(data, "diff")
        return cls(text(fields, "path"), fields.get("existed") is True, number(fields, "lines_added"), number(fields, "lines_removed"))


@dataclass(frozen=True)
class Tool:
    """The tool a hook is about: its name, its category, the files it names, its shell line when it runs one, and
    its diff when it edits or writes."""

    name: str
    category: str
    files: tuple[str, ...]
    shell: ShellLine | None
    diff: DiffCount | None

    @classmethod
    def parsed(cls, data: object) -> "Tool":
        fields = mapping(data, "tool")
        shell, diff = fields.get("shell"), fields.get("diff")
        return cls(text(fields, "name"), text(fields, "kind"), texts(fields, "files"), ShellLine.parsed(shell) if shell is not None else None,
                   DiffCount.parsed(diff) if diff is not None else None)


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

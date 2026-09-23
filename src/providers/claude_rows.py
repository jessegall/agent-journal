from dataclasses import dataclass, field

from engine.fields import Loaded
from engine.transcript import timestamp
from providers.payload import EditKind, FileEdit, Hunk, ToolCall

CREATED = "create"


@dataclass(frozen=True)
class Part(Loaded):
    text: str = ""


@dataclass(frozen=True)
class Block(Loaded):
    type: str = ""
    text: str = ""
    thinking: str = ""
    name: str = ""
    id: str = ""
    tool_use_id: str = ""
    input: dict = field(default_factory=dict)
    content: object = None
    is_error: bool = False

    @property
    def result(self) -> str:
        if isinstance(self.content, str):
            return self.content
        parts = self.content if isinstance(self.content, list) else []
        return "\n".join(Part.from_json(part).text for part in parts if isinstance(part, dict))


@dataclass(frozen=True)
class Origin(Loaded):
    aliases = {"sender": ("from",)}
    kind: str = ""
    name: str = ""
    sender: str = ""
    body: str = ""


@dataclass(frozen=True)
class Usage(Loaded):
    input_tokens: int = 0
    cache_read_input_tokens: int = 0
    cache_creation_input_tokens: int = 0

    @property
    def total(self) -> int:
        return self.input_tokens + self.cache_read_input_tokens + self.cache_creation_input_tokens


@dataclass(frozen=True)
class Message(Loaded):
    id: str = ""
    model: str = ""
    content: object = None
    usage: Usage | None = None


@dataclass(frozen=True)
class Attachment(Loaded):
    prompt: str = ""
    origin: Origin = Origin()


@dataclass(frozen=True)
class PatchHunk(Loaded):
    aliases = {"old_start": ("oldStart",), "new_start": ("newStart",)}
    old_start: int = 0
    new_start: int = 0
    lines: tuple[str, ...] = ()


@dataclass(frozen=True)
class EditResult(Loaded):
    aliases = {"path": ("filePath",), "patch": ("structuredPatch",)}
    type: str = ""
    path: str = ""
    content: str = ""
    patch: tuple[PatchHunk, ...] = ()

    def edits(self, key: str, at: float) -> list[FileEdit]:
        if self.type == CREATED:
            return [FileEdit(key, self.path, at, EditKind.NEW, (Hunk.added(self.content),))]
        hunks = tuple(Hunk(hunk.old_start, hunk.new_start, hunk.lines) for hunk in self.patch)
        return [FileEdit(key, self.path, at, EditKind.EDIT, hunks)] if hunks else []


@dataclass(frozen=True)
class Edited(Loaded):
    aliases = {"result": ("toolUseResult",)}
    result: EditResult = EditResult()


@dataclass(frozen=True)
class Entry(Loaded):
    aliases = {"parent": ("parentUuid",), "sidechain": ("isSidechain",), "agent_id": ("agentId",), "meta": ("isMeta",),
               "compact_summary": ("isCompactSummary",)}
    type: str = ""
    timestamp: str = ""
    parent: str = ""
    sidechain: bool = False
    agent_id: str = ""
    meta: bool = False
    compact_summary: bool = False
    message: Message = Message()
    attachment: Attachment = Attachment()
    origin: Origin = Origin()
    operation: str = ""
    content: str = ""


@dataclass(frozen=True)
class Row:
    type: str
    at: float = 0.0
    parent: str = ""
    sidechain: bool = False
    agent_id: str = ""
    meta: bool = False
    compact_summary: bool = False
    message_id: str = ""
    model: str = ""
    tokens: int | None = None
    text: str | None = None
    blocks: tuple = ()
    origin: Origin = field(default_factory=Origin)
    queued: Origin = field(default_factory=Origin)
    prompt: str = ""
    operation: str = ""
    content: str = ""

    @classmethod
    def from_payload(cls, raw: dict) -> "Row":
        entry = Entry.from_json(raw)
        message = entry.message
        content = message.content
        return cls(type=entry.type, at=timestamp(entry.timestamp), parent=entry.parent, sidechain=entry.sidechain, agent_id=entry.agent_id,
                   meta=entry.meta, compact_summary=entry.compact_summary, message_id=message.id, model=message.model,
                   tokens=message.usage.total if message.usage else None, text=content if isinstance(content, str) else None,
                   blocks=tuple(Block.from_json(block) for block in content if isinstance(block, dict)) if isinstance(content, list) else (),
                   origin=entry.origin, queued=entry.attachment.origin, prompt=entry.attachment.prompt, operation=entry.operation,
                   content=entry.content)

    @property
    def main(self) -> bool:
        return not self.sidechain

    def of_type(self, kind: str) -> list[Block]:
        return [block for block in self.blocks if block.type == kind]

    @property
    def tool_calls(self) -> list[ToolCall]:
        if self.type != "assistant" or self.sidechain:
            return []
        return [ToolCall.from_payload(block.id, block.name, self.at, block.input) for block in self.of_type("tool_use")]

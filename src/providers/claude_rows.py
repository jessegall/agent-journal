from dataclasses import dataclass, field

from engine.fields import list_of, mapping_of, number_of, text_of
from engine.transcript import timestamp
from providers.payload import ToolCall

USAGE = ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens")


@dataclass(frozen=True)
class Block:
    type: str
    text: str = ""
    thinking: str = ""
    name: str = ""
    id: str = ""
    tool_use_id: str = ""
    input: dict = field(default_factory=dict)
    result: str = ""
    is_error: bool = False

    @classmethod
    def from_payload(cls, raw: dict) -> "Block":
        content = raw.get("content")
        parts = content if isinstance(content, list) else []
        result = content if isinstance(content, str) else "\n".join(text_of(part, "text") for part in parts if isinstance(part, dict))
        return cls(type=text_of(raw, "type"), text=text_of(raw, "text"), thinking=text_of(raw, "thinking"), name=text_of(raw, "name"),
                   id=text_of(raw, "id"), tool_use_id=text_of(raw, "tool_use_id"), input=mapping_of(raw, "input"), result=result,
                   is_error=bool(raw.get("is_error")))


@dataclass(frozen=True)
class Origin:
    kind: str = ""
    name: str = ""
    sender: str = ""
    body: str = ""

    @classmethod
    def from_payload(cls, raw: dict) -> "Origin":
        return cls(kind=text_of(raw, "kind"), name=text_of(raw, "name"), sender=text_of(raw, "from"), body=text_of(raw, "body"))


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
        message, attachment = mapping_of(raw, "message"), mapping_of(raw, "attachment")
        content = message.get("content")
        usage = mapping_of(message, "usage")
        return cls(type=text_of(raw, "type"), at=timestamp(text_of(raw, "timestamp")), parent=text_of(raw, "parentUuid"),
                   sidechain=bool(raw.get("isSidechain")), agent_id=text_of(raw, "agentId"), meta=bool(raw.get("isMeta")),
                   compact_summary=bool(raw.get("isCompactSummary")), message_id=text_of(message, "id"), model=text_of(message, "model"),
                   tokens=sum(int(number_of(usage, key)) for key in USAGE) if usage else None,
                   text=content if isinstance(content, str) else None,
                   blocks=tuple(Block.from_payload(block) for block in list_of(message, "content") if isinstance(block, dict)),
                   origin=Origin.from_payload(mapping_of(raw, "origin")), queued=Origin.from_payload(mapping_of(attachment, "origin")),
                   prompt=text_of(attachment, "prompt"), operation=text_of(raw, "operation"), content=text_of(raw, "content"))

    @property
    def main(self) -> bool:
        return not self.sidechain

    def of_type(self, kind: str) -> list[Block]:
        return [block for block in self.blocks if block.type == kind]

    @property
    def tool_calls(self) -> list[ToolCall]:
        if self.type != "assistant" or self.sidechain:
            return []
        return [ToolCall.of(block.id, block.name, self.at, block.input) for block in self.of_type("tool_use")]

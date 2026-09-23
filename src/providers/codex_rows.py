from dataclasses import dataclass, field

from engine.fields import Loaded
from engine.transcript import timestamp

TEXT_PARTS = ("input_text", "output_text", "text")


@dataclass(frozen=True)
class ContentPart(Loaded):
    type: str = ""
    text: str = ""


def content_text(content) -> str:
    if isinstance(content, str):
        return content
    parts = (ContentPart.from_json(part) for part in (content if isinstance(content, list) else []) if isinstance(part, dict))
    return "\n".join(part.text for part in parts if part.type in TEXT_PARTS)


def either(raw: dict, snake: str, camel: str):
    return raw.get(snake) if snake in raw else raw.get(camel)


@dataclass(frozen=True)
class Limit:
    key: str
    used: float
    minutes: int
    resets: int

    @classmethod
    def from_payload(cls, key: str, raw: dict) -> "Limit":
        return cls(key, float(either(raw, "used_percent", "usedPercent")), int(either(raw, "window_minutes", "windowDurationMins")),
                   int(either(raw, "resets_at", "resetsAt")))


@dataclass(frozen=True)
class RateLimits(Loaded):
    primary: dict = field(default_factory=dict)
    secondary: dict = field(default_factory=dict)

    @property
    def limits(self) -> tuple[Limit, ...]:
        found = []
        for key, window in (("primary", self.primary), ("secondary", self.secondary)):
            try:
                found.append(Limit.from_payload(key, window))
            except (TypeError, ValueError):
                continue
        return tuple(found)


@dataclass(frozen=True)
class TokenUsage(Loaded):
    aliases = {"used": ("total_tokens", "input_tokens")}
    used: int = 0


@dataclass(frozen=True)
class TokenInfo(Loaded):
    last_token_usage: TokenUsage = TokenUsage()
    model_context_window: int = 0


@dataclass(frozen=True)
class Spawn(Loaded):
    parent_thread_id: str = ""


@dataclass(frozen=True)
class Subagent(Loaded):
    thread_spawn: Spawn = Spawn()


@dataclass(frozen=True)
class Source(Loaded):
    subagent: Subagent = Subagent()


@dataclass(frozen=True)
class Payload(Loaded):
    aliases = {"call": ("name",), "key": ("call_id", "id"), "arguments": ("arguments", "input"), "output_parts": ("output",),
               "rate_limits": ("rate_limits", "rateLimits")}
    type: str = ""
    role: str = ""
    namespace: str = ""
    call: str = ""
    key: str = ""
    arguments: object = None
    output: str = ""
    output_parts: object = None
    content: object = None
    info: TokenInfo = TokenInfo()
    rate_limits: RateLimits | None = None
    source: Source = Source()

    @property
    def name(self) -> str:
        return ".".join(part for part in (self.namespace, self.call) if part)

    @property
    def output_text(self) -> str:
        return content_text(self.output_parts)

    @property
    def text(self) -> str:
        return content_text(self.content)

    @property
    def used_tokens(self) -> int:
        return self.info.last_token_usage.used

    @property
    def window(self) -> int:
        return self.info.model_context_window

    @property
    def limits(self) -> tuple | None:
        return self.rate_limits.limits if self.rate_limits else None

    @property
    def parent_thread(self) -> str:
        return self.source.subagent.thread_spawn.parent_thread_id

    @property
    def argument_text(self) -> str:
        return "" if self.arguments is None else str(self.arguments)


@dataclass(frozen=True)
class Row:
    type: str
    at: float = 0.0
    payload: Payload = field(default_factory=Payload)

    @classmethod
    def from_payload(cls, raw: dict) -> "Row":
        entry = Entry.from_json(raw)
        return cls(type=entry.type, at=timestamp(entry.timestamp), payload=entry.payload)


@dataclass(frozen=True)
class Entry(Loaded):
    type: str = ""
    timestamp: str = ""
    payload: Payload = Payload()

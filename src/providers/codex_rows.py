from dataclasses import dataclass, field

from engine.fields import mapping_of, number_of, text_of
from engine.transcript import timestamp

TEXT_PARTS = ("input_text", "output_text", "text")


def content_text(content) -> str:
    if isinstance(content, str):
        return content
    parts = content if isinstance(content, list) else []
    return "\n".join(text_of(part, "text") for part in parts if isinstance(part, dict) and text_of(part, "type") in TEXT_PARTS)


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


def limits_of(raw) -> tuple[Limit, ...] | None:
    if not isinstance(raw, dict):
        return None
    found = []
    for key in ("primary", "secondary"):
        window = raw.get(key)
        if not isinstance(window, dict):
            continue
        try:
            found.append(Limit.from_payload(key, window))
        except (TypeError, ValueError):
            continue
    return tuple(found)


@dataclass(frozen=True)
class Payload:
    type: str = ""
    role: str = ""
    name: str = ""
    key: str = ""
    arguments: object = None
    output: str = ""
    output_text: str = ""
    text: str = ""
    used_tokens: int = 0
    window: int = 0
    limits: tuple | None = None
    parent_thread: str = ""

    @classmethod
    def from_payload(cls, raw: dict) -> "Payload":
        info = mapping_of(raw, "info")
        usage = mapping_of(info, "last_token_usage")
        spawn = mapping_of(mapping_of(mapping_of(raw, "source"), "subagent"), "thread_spawn")
        return cls(type=text_of(raw, "type"), role=text_of(raw, "role"),
                   name=".".join(part for part in (text_of(raw, "namespace"), text_of(raw, "name")) if part), key=text_of(raw, "call_id", "id"),
                   arguments=next((raw[key] for key in ("arguments", "input") if raw.get(key)), None), output=text_of(raw, "output"),
                   output_text=content_text(raw.get("output")),
                   text=content_text(raw.get("content")), used_tokens=int(number_of(usage, "total_tokens", "input_tokens")),
                   window=int(number_of(info, "model_context_window")), limits=limits_of(either(raw, "rate_limits", "rateLimits")),
                   parent_thread=text_of(spawn, "parent_thread_id"))

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
        payload = raw.get("payload")
        return cls(type=text_of(raw, "type"), at=timestamp(text_of(raw, "timestamp")),
                   payload=Payload.from_payload(payload) if isinstance(payload, dict) else Payload())

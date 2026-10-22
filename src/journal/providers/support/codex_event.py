from dataclasses import dataclass

from journal.providers.support.json_line import JsonLine

THREAD_STARTED = "thread.started"
ITEM_COMPLETED = "item.completed"
TURN_FAILED = "turn.failed"
AGENT_MESSAGE = "agent_message"


@dataclass(frozen=True)
class CodexEvent(JsonLine):
    """One line of codex exec --json, as far as the journal reads it: its type, the thread a start names, the text of a completed agent message and the message of a failed turn."""

    kind: str | None
    thread: str | None
    reply: str | None
    error: str | None

    @classmethod
    def blank(cls) -> "CodexEvent":
        return cls(None, None, None, None)

    @classmethod
    def built(cls, data: dict) -> "CodexEvent":
        item, error = data.get("item") or {}, data.get("error") or {}
        reply = item.get("text") if item.get("type") == AGENT_MESSAGE else None
        return cls(data.get("type"), data.get("thread_id"), reply, error.get("message"))

    def is_reply(self) -> bool:
        return self.kind == ITEM_COMPLETED and self.reply is not None

    def is_failure(self) -> bool:
        return self.kind == TURN_FAILED

    def is_thread_start(self) -> bool:
        return self.kind == THREAD_STARTED and bool(self.thread)

import json
from collections.abc import Iterator
from dataclasses import dataclass

from core.base.type_guards import is_mapping

THREAD_STARTED = "thread.started"
ITEM_COMPLETED = "item.completed"
TURN_FAILED = "turn.failed"
AGENT_MESSAGE = "agent_message"


@dataclass(frozen=True)
class CodexEvent:
    """One line of codex exec --json as the journal reads it: its type, the thread a start names, the text of a
    completed agent message and the message of a failed turn."""

    event_type: str
    thread: str
    reply: str | None
    error: str | None

    @classmethod
    def events(cls, output: str) -> Iterator["CodexEvent"]:
        for line in output.splitlines():
            try:
                fields: object = json.loads(line)
            except json.JSONDecodeError:
                continue
            if not is_mapping(fields):
                continue
            item, error = fields.get("item"), fields.get("error")
            reply = item.get("text") if is_mapping(item) and item.get("type") == AGENT_MESSAGE else None
            message = error.get("message") if is_mapping(error) else None
            yield cls(str(fields.get("type", "")), str(fields.get("thread_id", "")), reply if isinstance(reply, str) else None,
                      message if isinstance(message, str) else None)

    def is_reply(self) -> bool:
        return self.event_type == ITEM_COMPLETED and self.reply is not None

    def is_failure(self) -> bool:
        return self.event_type == TURN_FAILED and self.error is not None

    def is_thread_start(self) -> bool:
        return self.event_type == THREAD_STARTED and bool(self.thread)

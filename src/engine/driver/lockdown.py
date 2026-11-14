from dataclasses import dataclass

from engine.enums.hook_event_name import HookEventName
from engine.time.timestamp import Timestamp
from engine.errors.refusal import Refusal


@dataclass(frozen=True)
class Lockdown:
    """Whether a program is stopped at a usage limit, until when, the one line the journal gives about it, the
    reason and the suggestion a refused start gives, and the number of the user's limit that holds it, none
    when the plan's own window does."""

    ends_at: Timestamp | None = None
    stop_line: str = ""
    reason: str = ""
    suggestion: str = ""
    limit_id: int | None = None

    @property
    def is_active(self) -> bool:
        return self.ends_at is not None

    def start_refusal(self, agent_label: str) -> Refusal:
        return Refusal(f"no program can take this {agent_label}: {self.reason}", self.suggestion)

    def stops(self, event: HookEventName) -> bool:
        return self.is_active and event is not HookEventName.SESSION_END

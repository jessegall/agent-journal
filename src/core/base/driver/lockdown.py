from dataclasses import dataclass

from core.base.driver.hook_event_name import HookEventName
from core.base.timestamp import Timestamp
from engine.errors.refusal import Refusal


@dataclass(frozen=True)
class Lockdown:
    """Whether a program is stopped at a usage limit, until when, the one line the journal gives about it, and
    the reason and the suggestion a refused start gives."""

    ends_at: Timestamp | None = None
    stop_line: str = ""
    reason: str = ""
    suggestion: str = ""

    @property
    def is_active(self) -> bool:
        return self.ends_at is not None

    def start_refusal(self, agent_label: str) -> Refusal:
        return Refusal(f"no program can take this {agent_label}: {self.reason}", self.suggestion)

    def stops(self, event: HookEventName) -> bool:
        return self.is_active and event is not HookEventName.SESSION_END

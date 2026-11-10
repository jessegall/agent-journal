from dataclasses import dataclass

from core.base.driver.hook_event_name import HookEventName
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class Lockdown:
    """Whether a program is stopped at a usage limit, until when, and the one line the journal gives about it."""

    ends_at: Timestamp | None = None
    stop_line: str = ""

    @property
    def is_active(self) -> bool:
        return self.ends_at is not None

    def stops(self, event: HookEventName) -> bool:
        return self.is_active and event is not HookEventName.SESSION_END

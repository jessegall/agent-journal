from collections.abc import Mapping
from core.base.driver.hook_event_error import HookEventError
from dataclasses import dataclass

HOOK_HEADERS = ("X-Journal-Hook-Id", "X-Journal-Request-At", "X-Journal-Actor", "X-Journal-Env")


@dataclass(frozen=True)
class HookHeaders:
    """What version 4's hook sends beside a raw body: its firing id, when it fired in milliseconds, its actor and
    its environment."""

    firing: str
    hook_timestamp_ms: int
    actor: str
    environment: str

    @classmethod
    def parsed(cls, headers: Mapping[str, str]) -> "HookHeaders":
        missing = [name for name in HOOK_HEADERS if name not in headers]
        if missing or not headers["X-Journal-Request-At"].isdigit():
            raise HookEventError(f"a raw hook body comes with the headers the hook sends: {', '.join(HOOK_HEADERS)}")
        return cls(headers["X-Journal-Hook-Id"], int(headers["X-Journal-Request-At"]), headers["X-Journal-Actor"], headers["X-Journal-Env"])

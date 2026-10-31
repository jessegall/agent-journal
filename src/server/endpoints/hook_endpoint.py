from collections.abc import Mapping

from core.base.timing import Timing
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_error import HookEventError
from server.hook.raw_hook_body import HookHeaders, RawHookBody, is_raw_body


class HookEndpoint:
    """Answers POST /hook: reads a hook's object, prepared or raw, stamps each step, and lets the hook through."""

    def __init__(self, timing: Timing) -> None:
        self.timing = timing

    def event(self, data: object, program: str, headers: Mapping[str, str]) -> HookEvent:
        event = RawHookBody.parsed(data).event(program, HookHeaders.parsed(headers)) if is_raw_body(data) else HookEvent.parsed(data)
        self.timing.stamp("hook_read")
        return event

    def answer(self, event: HookEvent) -> str:
        if event.program not in ("claude", "codex"):
            raise HookEventError(f"no agent program is named {event.program!r}")
        self.timing.stamp("hook_answered")
        return ""

from collections.abc import Mapping

from server.hook.hook_event import HookEvent, HookEventError
from server.hook.raw_hook_body import HookHeaders, RawHookBody, is_raw_body


class HookEndpoint:
    """Answers POST /hook: reads the object a hook sends, prepared by the Go program or raw, and answers what the
    agent program is to do. Until the drivers decide, every hook is let through with an empty answer."""

    def event(self, data: object, program: str, headers: Mapping[str, str]) -> HookEvent:
        if is_raw_body(data):
            return RawHookBody.parsed(data).event(program, HookHeaders.parsed(headers))
        return HookEvent.parsed(data)

    def answer(self, event: HookEvent) -> str:
        if event.program not in ("claude", "codex"):
            raise HookEventError(f"no agent program is named {event.program!r}")
        return ""

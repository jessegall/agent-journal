from collections.abc import Sequence
from dataclasses import dataclass

from core.base.driver.hook_call_like import HookCallLike


@dataclass(frozen=True)
class HookReply:
    """What the journal answers a hook: its refusal, if any, the lines the agent reads, and the hook call row."""

    refusal: str = ""
    lines: Sequence[str] = ()
    hook_call_id: int | None = None

    @classmethod
    def allowed(cls, *lines: str) -> "HookReply":
        return cls(lines=lines)

    @classmethod
    def stored(cls, call: HookCallLike) -> "HookReply":
        return cls(call.refusal, call.lines.splitlines(), call.id)

    def json(self) -> dict[str, object]:
        return {"refusal": self.refusal, "lines": list(self.lines), "hook_call_id": self.hook_call_id}

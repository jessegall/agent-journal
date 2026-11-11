from dataclasses import dataclass

from engine.driver.nudge import Nudge
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType
from engine.driver.span import Span
from engine.driver.times_span import TimesSpan

COUNTDOWN_TOOL_USES = 3


@dataclass(frozen=True)
class CountDown:
    """A line counting down to a hold: the action due and how much of its span remains, the one form every such
    line takes, such as read message 123 due: 3 tool uses. A silent one says nothing, and any other says its
    line only once fewer than line_limit remain."""

    key: str
    action: str
    span: Span | TimesSpan
    is_silent: bool = False
    line_limit: int = COUNTDOWN_TOOL_USES

    @property
    def declaration(self) -> NudgeDeclaration:
        return NudgeDeclaration(self.key, NudgeType.STEERING, f"{self.action} due: {{remaining}} {self.span.unit}", turn_limited=False)

    def nudge(self, remaining: object, **fields: object) -> Nudge:
        return self.declaration.nudge(remaining=remaining, **fields)

    def remaining_after(self, used_count: int) -> int:
        return max(self.span.count - used_count, 0)

    def line_at(self, remaining: int, **fields: object) -> Nudge | None:
        if self.is_silent or remaining >= self.line_limit:
            return None
        return self.nudge(remaining, **fields)

from dataclasses import dataclass

from core.base.driver.nudge import Nudge
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.span import Span
from core.base.driver.times_span import TimesSpan

COUNTDOWN_FROM = 3


@dataclass(frozen=True)
class CountDown:
    """A line counting down to a hold: the action due and how much of its span remains, the one form every such
    line takes, such as read message 123 due: 3 tool uses. A silent one says nothing, and any other says its
    line only once fewer than says_from remain."""

    key: str
    action: str
    span: Span | TimesSpan
    is_silent: bool = False
    says_from: int = COUNTDOWN_FROM

    @property
    def declaration(self) -> NudgeDeclaration:
        return NudgeDeclaration(self.key, NudgeType.STEERING, f"{self.action} due: {{remaining}} {self.span.unit}", turn_limited=False)

    def nudge(self, remaining: object, **fields: object) -> Nudge:
        return self.declaration.nudge(remaining=remaining, **fields)

    def left_after(self, used_count: int) -> int:
        return max(self.span.count - used_count, 0)

    def line_at(self, left: int, **fields: object) -> Nudge | None:
        if self.is_silent or left >= self.says_from:
            return None
        return self.nudge(left, **fields)

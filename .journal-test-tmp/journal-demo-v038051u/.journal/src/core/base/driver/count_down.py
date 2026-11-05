from dataclasses import dataclass

from core.base.driver.nudge import Nudge
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.driver.span import Span


@dataclass(frozen=True)
class CountDown:
    """A line counting down to a hold: the action due and how much of its span remains, the one form every such
    line takes, such as read message 123 due: 3 tool uses."""

    key: str
    action: str
    span: Span

    @property
    def declaration(self) -> NudgeDeclaration:
        return NudgeDeclaration(self.key, NudgeType.STEERING, f"{self.action} due: {{remaining}} {self.span.unit}", turn_limited=False)

    def nudge(self, remaining: object, **fields: object) -> Nudge:
        return self.declaration.nudge(remaining=remaining, **fields)

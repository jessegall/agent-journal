from dataclasses import dataclass

from core.base.driver.interval import Interval
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType

CUT_MARK = "…"
CUT_END_CHARACTERS = 60


@dataclass(frozen=True)
class NudgeDeclaration:
    """A line a module can say to an agent, declared once: its key, its type, its words with {fields}, the
    interval before it may be said again, the longest it may be, cut in its middle so its instruction stays, 0
    meaning no limit, and whether a turn says it only once; a reminder on a clock says no."""

    key: str
    type: NudgeType
    text: str
    interval: Interval | None = None
    longest_characters: int = 0
    turn_limited: bool = True

    def nudge(self, **fields: object) -> Nudge:
        return Nudge(self.key, self.type, self.cut(self.text.format(**fields)), self.interval, self.turn_limited)

    def cut(self, line: str) -> str:
        if not self.longest_characters or len(line) <= self.longest_characters:
            return line
        end = min(CUT_END_CHARACTERS, self.longest_characters // 2)
        return line[: self.longest_characters - len(CUT_MARK) - end] + CUT_MARK + line[-end:]

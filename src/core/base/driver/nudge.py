from dataclasses import dataclass

from core.base.driver.interval import Interval
from core.base.driver.nudge_type import NudgeType


@dataclass(frozen=True)
class Nudge:
    """One line said to an agent: the key and the type of its declaration, its words with their fields filled
    in, the interval before it may be said again, whether a turn says it only once, and the command that settles it, if it names one to run."""

    key: str
    type: NudgeType
    text: str
    interval: Interval | None = None
    turn_limited: bool = True
    pays: str = ""

    @property
    def labelled(self) -> str:
        return f"journal: {self.text}"

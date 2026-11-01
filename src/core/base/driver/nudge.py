from dataclasses import dataclass

from core.base.driver.nudge_type import NudgeType


@dataclass(frozen=True)
class Nudge:
    """One line said to an agent: the key and the type of its declaration, its words with their fields filled
    in, how long before it may be said again, and whether a turn says it only once."""

    key: str
    type: NudgeType
    text: str
    repeat_seconds: int = 0
    turn_limited: bool = True

    @property
    def labelled(self) -> str:
        return f"{self.type.value}: {self.text}"

import re
from dataclasses import dataclass
from enum import StrEnum


class Reach(StrEnum):
    MAIN = "main"
    SUBAGENTS = "subagents"
    BOTH = "both"

    def reaches(self, subagent: bool) -> bool:
        return self is Reach.BOTH or (self is Reach.SUBAGENTS) == subagent


class Unreached(Exception):
    def __init__(self, what: str):
        super().__init__(f"{what} states no reach: give it Reach.MAIN, Reach.SUBAGENTS or Reach.BOTH")


@dataclass(frozen=True)
class Guard:
    name: str
    reach: Reach

    @classmethod
    def of(cls, guard) -> "Guard":
        named = type(guard).__name__
        try:
            reach = guard.reach
        except AttributeError as missing:
            raise Unreached(named) from missing
        if not isinstance(reach, Reach):
            raise Unreached(named)
        return cls(re.sub(r"(?<!^)(?=[A-Z])", " ", named).capitalize(), reach)

    def reaches(self, subagent: bool) -> bool:
        return self.reach.reaches(subagent)

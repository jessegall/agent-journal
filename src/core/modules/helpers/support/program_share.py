from dataclasses import dataclass

from core.base.refusal import Refusal


@dataclass(frozen=True)
class ProgramShare:
    """One program's percentage of new work."""

    program: str
    percent: int

    @classmethod
    def parsed(cls, line: str) -> "ProgramShare":
        words = line.split()
        if len(words) != 2 or not words[1].isdecimal():
            raise Refusal(f"invalid program share {line!r}", "use a program and a whole percentage, such as <program> 20")
        percent = int(words[1])
        if percent > 100:
            raise Refusal("a program share is between 0 and 100", "choose a whole percentage")
        return cls(words[0], percent)

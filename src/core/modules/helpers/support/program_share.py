from dataclasses import dataclass

from engine.errors.refusal import Refusal


@dataclass(frozen=True)
class ProgramShare:
    """One program's percentage of new work."""

    program: str
    percent: int

    @classmethod
    def parsed(cls, line: str) -> "ProgramShare":
        parts = line.split()
        if len(parts) != 2 or not parts[1].isdecimal():
            raise Refusal(f"invalid program share {line!r}", "use a program and a whole percentage, such as <program> 20")
        percent = int(parts[1])
        if percent > 100:
            raise Refusal("a program share is between 0 and 100", "choose a whole percentage")
        return cls(parts[0], percent)

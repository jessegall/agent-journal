from dataclasses import dataclass


@dataclass(frozen=True)
class Part:
    """One command of a chain, and whether it is the agent's own, recorded, or the shell's own wrapping around it, run in silence."""

    text: str
    recorded: bool = True

    def kind(self) -> str:
        return "R" if self.recorded else "S"

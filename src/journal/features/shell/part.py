from dataclasses import dataclass


@dataclass(frozen=True)
class Part:
    """One command of a chain: whether it is the agent's own, recorded, or the shell's own wrapping, run in silence; and whether it runs whatever the part before it came to (after a ;) or only after a success (after a &&)."""

    text: str
    recorded: bool = True
    always: bool = True

    def kind(self) -> str:
        return ("R" if self.recorded else "S") + (";" if self.always else "&")

from dataclasses import dataclass


@dataclass(frozen=True)
class Decision:
    """What the hook script tells the agent back: go on, stop, or go on and read this."""

    allowed: bool = True
    reason: str = ""
    context: str = ""

    def merged(self, other: "Decision") -> "Decision": ...

    def as_hook_output(self) -> dict: ...

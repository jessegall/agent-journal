from dataclasses import dataclass


@dataclass(frozen=True)
class Decision:
    """What the hook script tells the agent back: go on, stop, or go on and read this."""

    allowed: bool = True
    reason: str = ""
    context: str = ""

    def merged(self, other: "Decision") -> "Decision": ...

    @property
    def status(self) -> int:
        """200 to go on, 409 when refused; the hook script turns it into the agent's exit code."""
        ...

    def as_hook_output(self) -> dict: ...

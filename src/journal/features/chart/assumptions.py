from dataclasses import dataclass


@dataclass(frozen=True)
class Assumptions:
    """The state a trial stands in instead of the live one, each piece only when given: how long the agent has been quiet, the edits since the log, the unread messages."""

    quiet: float | None = None
    edits: int | None = None
    unread: int | None = None

    def described(self) -> list[str]:
        """Each assumption in words, so the trial's output says what it did not read from the rows."""
        said = []
        if self.quiet is not None:
            said.append(f"quiet for {int(self.quiet)} s")
        if self.edits is not None:
            said.append(f"{self.edits} edits since the log")
        if self.unread is not None:
            said.append(f"{self.unread} unread messages")
        return said

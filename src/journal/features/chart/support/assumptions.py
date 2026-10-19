from dataclasses import dataclass, field


@dataclass(frozen=True)
class Assumptions:
    """The state a trial stands in instead of the live one, each piece only when given: how long the agent has been quiet, the edits since the log, the unread messages, a workflow's counts."""

    quiet: float | None = None
    edits: int | None = None
    unread: int | None = None
    state: str | None = None
    provider: str | None = None
    counts: dict = field(default_factory=dict)
    """A workflow's counts by name, as the trial stands them in for the agent's own."""

    def described(self) -> list[str]:
        """Each assumption in words, so the trial's output says what it did not read from the rows."""
        said = []
        if self.quiet is not None:
            said.append(f"quiet for {int(self.quiet)} s")
        if self.edits is not None:
            said.append(f"{self.edits} edits since the log")
        if self.unread is not None:
            said.append(f"{self.unread} unread messages")
        if self.state is not None:
            said.append(f"the agent {self.state}")
        if self.provider is not None:
            said.append(f"a {self.provider} agent")
        said += [f"the count {name} at {value}" for name, value in self.counts.items()]
        return said

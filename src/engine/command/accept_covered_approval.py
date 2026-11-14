from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class AcceptCoveredApproval(Command[str | None]):
    """Runs at once the caller's newest open approval request that a standing yes covers, outside any
    transaction, and gives what it printed; None when no standing yes covers the caller's request."""

    lock = False

from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class AcceptCoveredApproval(Command[str | None]):
    """Runs at once the caller's newest open approval request that a saved yes covers, outside any
    transaction, and gives what it printed; None when no saved yes covers the caller's request."""

    lock = False

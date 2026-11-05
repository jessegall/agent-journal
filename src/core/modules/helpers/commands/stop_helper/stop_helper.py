from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class StopHelper(Command[None]):
    """Stops a helper's program and ends its job."""

    helper_id: int

from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecoverSilentAgents(Command[None]):
    """Checks the connection and resumes agents whose work has stopped."""

    environment_id: int

from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class WakeInterruptedAgent(Command[None]):
    """Gives an agent whose turn was interrupted the line that it goes on with its work, and types it into its
    terminal."""

    agent_id: int

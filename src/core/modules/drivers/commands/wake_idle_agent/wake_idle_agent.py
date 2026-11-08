from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class WakeIdleAgent(Command[None]):
    """Gives an idle agent a short line that asks for no work, so its prompt cache stays warm, and types it into its terminal."""

    agent_id: int

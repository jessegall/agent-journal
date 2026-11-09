from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class WakeAgent(Command[None]):
    """A command that wakes one agent with a line."""

    agent_id: int

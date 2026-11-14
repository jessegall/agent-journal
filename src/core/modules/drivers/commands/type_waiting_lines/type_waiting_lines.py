from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class TypeWaitingLines(Command[None]):
    """Types the lines that wait for an agent, as its usage limit ends."""

    agent_id: int

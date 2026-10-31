from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class MemoryFade(Command[None]):
    """Lowers by one the weight of each fading memory in one agent's own scope."""

    agent_id: int

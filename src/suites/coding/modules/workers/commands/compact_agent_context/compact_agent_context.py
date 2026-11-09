from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class CompactAgentContext(Command[None]):
    """Types the context-limit action into an agent's terminal and remembers the context size it was asked at, so
    no rule types it again for that size."""

    agent_id: int

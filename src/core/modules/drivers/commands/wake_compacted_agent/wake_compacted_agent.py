from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class WakeCompactedAgent(Command[None]):
    """Gives an agent left at its prompt by a compaction the line that it goes on with its work, and types it
    into its terminal."""

    agent_id: int

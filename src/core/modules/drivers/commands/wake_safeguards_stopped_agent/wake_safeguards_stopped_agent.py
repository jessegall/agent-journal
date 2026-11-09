from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class WakeSafeguardsStoppedAgent(Command[None]):
    """Gives an agent whose turn an API safeguards error ended the line to go on with its work, and types it into
    its terminal."""

    agent_id: int

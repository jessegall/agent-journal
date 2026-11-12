from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CloseAgentBlocks(Command[None]):
    """Ends the blocks of one hook whose conditions have become true, reading them together."""

    agent_block_ids: tuple[int, ...]

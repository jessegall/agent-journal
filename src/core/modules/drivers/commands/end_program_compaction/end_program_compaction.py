from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class EndProgramCompaction(Command[None]):
    """Records that the program run that compacted an agent has ended and the agent goes on with its job."""

    agent_id: int

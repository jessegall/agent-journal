from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordAgentLaunchFailure(Command[None]):
    """Records that an agent's program could not start."""

    agent_id: int

from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class StopAgent(Command[Agent]):
    """Stops a running agent's program and ends its session, with its tasks released unless told to retain them."""

    agent_id: int
    retain_tasks: bool = False

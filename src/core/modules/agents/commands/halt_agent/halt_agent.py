from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class HaltAgent(Command[Agent]):
    """Records that a hook of the agent was stopped at its program's usage limit; an agent already halted is left
    as it is."""

    lock = True

    agent_id: int

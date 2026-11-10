from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class ChooseAgentControl(Command[Agent]):
    """Applies one choice of the agent bar to a running agent's program, by typing the line the program takes
    for it."""

    lock = False

    agent_id: int
    key: str
    value: str

from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class BindAgentSession(Command[Agent]):
    """Gives an agent started under its launch name the session its program chose."""

    row_id: int
    session: str

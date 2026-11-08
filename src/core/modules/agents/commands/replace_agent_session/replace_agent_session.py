from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class ReplaceAgentSession(Command[Agent]):
    """Gives a stopped agent a new program session, so its next launch starts over under the same journal agent."""

    row_id: int

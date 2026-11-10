from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.end_reason import EndReason


@dataclass(frozen=True)
class ReplaceAgentSession(Command[Agent]):
    """Gives a stopped agent a new program session, so its next launch starts over under the same journal agent.
    The reason is written on the session it replaces."""

    row_id: int
    reason: EndReason

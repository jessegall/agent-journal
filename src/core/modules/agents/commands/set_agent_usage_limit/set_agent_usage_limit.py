from dataclasses import dataclass

from core.base.command.command import Command
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class SetAgentUsageLimit(Command[Agent]):
    """Marks an agent as at its program's usage limit until the allowance starts again, or clears the mark."""

    agent_id: int
    limited_until: Timestamp | None

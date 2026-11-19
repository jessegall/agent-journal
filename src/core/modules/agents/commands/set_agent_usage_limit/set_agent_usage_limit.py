from dataclasses import dataclass

from engine.command.command import Command
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class SetAgentUsageLimit(Command[Agent]):
    """Marks an agent as at its program's usage limit until the allowance starts again, or clears the mark."""

    lock = True

    agent_id: int
    usage_limit_ends_at: Timestamp | None

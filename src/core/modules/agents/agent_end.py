from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.agent import Agent


@dataclass(frozen=True)
class AgentEnd(Command[Agent]):
    """Ends an agent session: it no longer names a caller, by its session or by its process."""

    row_id: int

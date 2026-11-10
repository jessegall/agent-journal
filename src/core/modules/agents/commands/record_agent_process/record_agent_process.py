from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class RecordAgentProcess(Command[Agent]):
    """Keeps the process the launcher started an agent's program in; none says the launcher named none, so an older
    process is not taken for this one."""

    agent_id: int
    pid: int | None

from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.agent_wake import AgentWake


@dataclass(frozen=True)
class ReopenAgentWake(Command[AgentWake]):
    """Puts a claimed wake back to open when its transport failed, with why (doc 1310 section 6.4)."""

    lock = True

    wake_id: int
    failure: str

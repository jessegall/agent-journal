from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.agent_wake import AgentWake


@dataclass(frozen=True)
class ClaimAgentWake(Command[AgentWake | None]):
    """Takes one due wake obligation through its next move, in its own write (doc 1310 section 6.4): the claimed row
    when the owner may now send it, or nothing."""

    lock = True

    wake_id: int

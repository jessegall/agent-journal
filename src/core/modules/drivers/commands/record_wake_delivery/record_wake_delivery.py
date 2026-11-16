from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.agent_wake import AgentWake


@dataclass(frozen=True)
class RecordWakeDelivery(Command[AgentWake]):
    """Records that the wake's transport sent it, after the claim's write (doc 1310 section 6.4)."""

    wake_id: int

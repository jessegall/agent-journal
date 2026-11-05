from dataclasses import dataclass

from core.base.command.command import Command
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class ReportSilentAgent(Command[None]):
    """Tells the main agent why an agent could not be resumed."""

    agent_id: int
    reason: str
    since_at: Timestamp

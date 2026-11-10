from dataclasses import dataclass

from engine.command.command import Command
from engine.time.timestamp import Timestamp

SILENT_FAILURE_SOURCE = "workers.silent-agent-failed"


@dataclass(frozen=True)
class ReportSilentAgent(Command[None]):
    """Tells the main agent why an agent could not be resumed."""

    agent_id: int
    reason: str
    inactive_at: Timestamp

from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.driver.nudge_type import NudgeType
from core.base.timestamp import Timestamp

SILENT_FAILURE_SOURCE = "workers.silent-agent-failed"
SILENT_AGENT_FAILED = NudgeDeclaration("workers.silent_agent_failed", NudgeType.STEERING, "agent:{agent} could not resume: {reason}. Check its terminal.", turn_limited=False, wakes_agent=True)


@dataclass(frozen=True)
class ReportSilentAgent(Command[None]):
    """Tells the main agent why an agent could not be resumed."""

    agent_id: int
    reason: str
    inactive_at: Timestamp

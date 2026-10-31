from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class ReportCheck(Command[Check]):
    """Notes that the agent was told a check fails."""

    check_id: int

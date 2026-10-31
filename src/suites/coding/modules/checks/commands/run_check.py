from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class RunCheck(Command[Check]):
    """Runs a check's command at once and keeps whether it passed and what it printed."""

    check_id: int

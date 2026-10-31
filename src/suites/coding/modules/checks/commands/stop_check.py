from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class StopCheck(Command[Check]):
    """Stops a check: it runs no more by itself or by hand."""

    check_id: int

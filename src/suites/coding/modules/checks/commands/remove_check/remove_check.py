from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class RemoveCheck(Command[Check]):
    """Removes a check: it runs no more and is not listed."""

    check_id: int

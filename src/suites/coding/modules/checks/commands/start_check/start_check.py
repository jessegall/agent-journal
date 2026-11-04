from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class StartCheck(Command[Check]):
    """Starts a stopped check: it runs again by hand and on its schedule."""

    check_id: int

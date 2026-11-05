from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class MakeCheck(Command[Check]):
    """Writes a check: its title, the command that proves the point, its brief and how often it runs."""

    title: str
    command: str
    brief: str = ""
    interval_minutes: int = 0

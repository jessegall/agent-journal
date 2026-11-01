from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class EditCheck(Command[Check]):
    """Changes what a check says, runs or how often it runs; what is left out stays."""

    check_id: int
    title: str | None = None
    command: str | None = None
    brief: str | None = None
    interval_minutes: int | None = None

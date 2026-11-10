from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class RecordCheckProgress(Command[Check]):
    """Records how far a check's running command has come, 0 to 100, or that none runs."""

    check_id: int
    percent: int | None

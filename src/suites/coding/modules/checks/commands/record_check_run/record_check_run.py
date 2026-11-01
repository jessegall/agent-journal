from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.checks.models.check import Check


@dataclass(frozen=True)
class RecordCheckRun(Command[Check]):
    """Keeps whether a check's run, already finished outside the transaction, passed and what it printed."""

    check_id: int
    passed: bool
    output: str

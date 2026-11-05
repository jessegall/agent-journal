from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordAffectedTest(Command[None]):
    """Records the end of a picker or selected test process."""

    test_id: int
    process_id: int
    passed: bool

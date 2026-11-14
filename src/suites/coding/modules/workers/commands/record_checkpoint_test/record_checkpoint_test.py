from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordCheckpointTest(Command[None]):
    """Records how the process of a test of a checkpoint run ended."""

    test_id: int
    passed: bool

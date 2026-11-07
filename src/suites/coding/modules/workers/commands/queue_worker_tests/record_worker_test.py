from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordWorkerTest(Command[None]):
    """Records how the process of a worker's test ended, and what follows when it was that worker's last."""

    proof_id: int
    passed: bool
    output_note: str

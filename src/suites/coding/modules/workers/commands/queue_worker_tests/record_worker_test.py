from dataclasses import dataclass

from engine.command.command import Command

ENDED_RUN_NOTE = "failed: journal output read of process {process}"
GONE_RUN_NOTE = "lost: process {process} is gone with no result recorded"


@dataclass(frozen=True)
class RecordWorkerTest(Command[None]):
    """Records how the process of a worker's test ended, and what follows when it was that worker's last."""

    proof_id: int
    passed: bool
    output_note: str

from dataclasses import dataclass

from engine.command.command import Command

STUCK_RUN_NOTE = "stuck: the run went past {minutes} minutes and was ended: journal output read of process {process}"


@dataclass(frozen=True)
class EndStuckProofRun(Command[None]):
    """Ends the test run of a proof that has run longer than the limit, records it as failed, and tells the worker
    and the merger."""

    proof_id: int
    minutes: int

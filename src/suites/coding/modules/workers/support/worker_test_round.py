from collections.abc import Iterable
from dataclasses import dataclass
from operator import attrgetter

from engine.change.logged_event import LoggedEvent
from suites.coding.modules.workers.models.enums.proof_state import ProofState


@dataclass(frozen=True)
class WorkerTestRound:
    """The waiting and failed proofs of a task's test round through one event."""

    waiting_count: int
    failed_count: int

    @classmethod
    def build(cls, events: Iterable[LoggedEvent]) -> "WorkerTestRound":
        waiting: set[int] = set()
        failed: set[int] = set()
        for event in sorted(events, key=attrgetter("id")):
            if "state" not in event.data:
                continue
            state = ProofState(event.data["state"][1])
            if state in (ProofState.SHOWN, ProofState.RUNNING):
                continue
            match state:
                case ProofState.QUEUED:
                    waiting.add(event.row_id)
                    failed.discard(event.row_id)
                case ProofState.CHECKED:
                    waiting.discard(event.row_id)
                    failed.discard(event.row_id)
                case ProofState.SHORT:
                    waiting.discard(event.row_id)
                    failed.add(event.row_id)
        return cls(len(waiting), len(failed))

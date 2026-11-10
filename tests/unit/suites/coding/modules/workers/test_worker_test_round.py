from types import MappingProxyType

from core.base.change.logged_event import LoggedEvent
from engine.time.timestamp import Timestamp
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.support.worker_test_round import WorkerTestRound


def change(event_id: int, proof_id: int, state: ProofState) -> LoggedEvent:
    return LoggedEvent(id=event_id, event=f"proof.{state.value}", row_table="proofs", row_id=proof_id,
                       environment_id=1, actor_id=1, command="", cause_id=None, skipped_guards=frozenset(),
                       timestamp=Timestamp.parsed("2026-11-05T12:00:00+00:00"),
                       data=MappingProxyType({"state": (None, state.value)}))


def test_two_proofs_in_one_round_end_only_when_both_pass():
    queued = [change(1, 1, ProofState.QUEUED), change(2, 2, ProofState.QUEUED), change(3, 1, ProofState.CHECKED)]
    assert WorkerTestRound.build(queued) == WorkerTestRound(1, 0)
    assert WorkerTestRound.build([*queued, change(4, 2, ProofState.CHECKED)]) == WorkerTestRound(0, 0)


def test_new_tests_after_a_pass_get_the_next_round():
    events = [change(1, 1, ProofState.QUEUED), change(2, 1, ProofState.CHECKED), change(3, 2, ProofState.QUEUED)]
    assert WorkerTestRound.build(events) == WorkerTestRound(1, 0)
    assert WorkerTestRound.build([*events, change(4, 2, ProofState.CHECKED)]) == WorkerTestRound(0, 0)


def test_a_failed_test_retried_until_it_passes_stays_in_one_round():
    events = [change(1, 1, ProofState.QUEUED), change(2, 1, ProofState.SHORT),
              change(3, 1, ProofState.SHOWN), change(4, 1, ProofState.QUEUED), change(5, 1, ProofState.CHECKED)]
    assert WorkerTestRound.build(events) == WorkerTestRound(0, 0)

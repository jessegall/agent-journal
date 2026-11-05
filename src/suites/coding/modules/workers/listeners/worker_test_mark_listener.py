from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.change.moved import Moved
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle



class WorkerTestMarkListener(MarkListener[Moved[Proof]]):
    """The tests of each task of a worker show as one mark in the chat: queued when they are handed over, failed
    until they run again, and ended when the last has passed."""

    name = "workers.test-mark"
    moves = (ProofLifecycle.queue, ProofLifecycle.check, ProofLifecycle.short)
    module_name = "journal.suites.coding.workers"

    def handle(self, event: Moved[Proof], logged: LoggedEvent) -> None:
        proof = event.row
        if not proof.test_command:
            return
        worktree = self.queries.query(Worktree).find(proof.worktree_id)
        proofs = tuple(self.queries.query(Proof).filter(worktree_id=worktree.id).all_rows())
        worker = worktree.agent_id
        if event.move is ProofLifecycle.queue:
            self.mark(logged, worktree, proof, WorkerMarkVariant.QUEUED, f"Tests of worker {worker} queued", False)
        elif not any(row.state in TEST_WAITING_STATES for row in proofs):
            failed = sum(row.state is ProofState.SHORT for row in proofs)
            self.mark(logged, worktree, proof, WorkerMarkVariant.FAILED if failed else WorkerMarkVariant.PASSED, f"Tests of worker {worker}: {failed} failed, back with the worker" if failed else f"Tests of worker {worker} passed", not failed)

    def mark(self, logged: LoggedEvent, worktree: Worktree, proof: Proof, variant: WorkerMarkVariant, text: str, ended: bool) -> None:
        self.show(logged, WorkerMarkType.TESTS, variant, text, worktree.environment_id, worktree.agent_id, key=f"worker-tests:{worktree.id}:{proof.task_id}", ended=ended)

from core.base.change.logged_event import LoggedEvent
from core.base.change.event_log import EventLog
from engine.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.base.listener.event_rows import EventRows
from core.modules.chat.listeners.mark_listener import MarkListener
from suites.coding.modules.workers.models.enums.worker_mark_type import WorkerMarkType
from suites.coding.modules.workers.models.enums.worker_mark_variant import WorkerMarkVariant
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.change.moved import Moved
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.support.worker_test_round import WorkerTestRound



class WorkerTestMarkListener(MarkListener[Moved[Proof]]):
    """The tests of each task of a worker show as one mark in the chat: queued when they are handed over, failed
    until they run again, and ended when the last has passed."""

    name = "workers.test-mark"
    moves = (ProofLifecycle.queue, ProofLifecycle.check, ProofLifecycle.short)
    module_name = "journal.suites.coding.workers"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, events: EventLog, event_rows: EventRows) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.events = events

    def handle(self, event: Moved[Proof], logged: LoggedEvent) -> None:
        proof = event.row
        if not proof.test_command:
            return
        worktree = self.event_rows.required(Worktree, proof.worktree_id)
        proofs = tuple(self.queries.query(Proof).filter(worktree_id=worktree.id, task_id=proof.task_id).all_rows())
        round = WorkerTestRound.build(change for row in proofs if row.test_command
                                           for change in self.events.row_events(logged.row_table, row.id) if change.id <= logged.id)
        worker = worktree.session_agent_id
        if event.move is ProofLifecycle.queue:
            self.mark(logged, worktree, proof, WorkerMarkVariant.QUEUED, f"Tests of worker {worker} queued", False)
        elif not round.waiting_count:
            failed = round.failed_count
            self.mark(logged, worktree, proof, WorkerMarkVariant.FAILED if failed else WorkerMarkVariant.PASSED, f"Tests of worker {worker}: {failed} failed, back with the worker" if failed else f"Tests of worker {worker} passed", not failed)

    def mark(self, logged: LoggedEvent, worktree: Worktree, proof: Proof, variant: WorkerMarkVariant, text: str, ended: bool) -> None:
        self.show(logged, WorkerMarkType.TESTS, variant, text, worktree.session_agent_id,
                  key=f"worker-tests:{worktree.id}:{proof.task_id}", ended=ended)

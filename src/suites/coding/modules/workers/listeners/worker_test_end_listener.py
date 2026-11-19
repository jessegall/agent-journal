from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.queue_worker_tests.record_affected_test import RecordAffectedTest
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import ENDED_RUN_NOTE, RecordWorkerTest
from suites.coding.modules.workers.commands.record_own_test_failure.record_own_test_failure import RecordOwnTestFailure
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.listeners.support.worker_test_starts import WorkerTestStarts
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.proof_test_command import ProofTestCommand
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.output_end import FAILURES_END_BYTES


class WorkerTestEndListener(CommitListener[Moved[Process]]):
    """A worker's test whose process ended is recorded for each proof that shared the run, which makes room for the next; a failed test run of a
    worker that no proof asked for is noted on its task, and an affected-test pick gets its answer."""

    name = "workers.test-ends"
    run_order = -1
    moves = [ProcessLifecycle.finish, ProcessLifecycle.fail, ProcessLifecycle.stop, ProcessLifecycle.orphan]

    def __init__(self, bus: Bus, queries: Queries, starts: WorkerTestStarts, proofs: ProofQuery, worktrees: WorktreeQuery, output: OutputFolder) -> None:
        self.bus, self.queries, self.starts, self.proofs, self.worktrees, self.output = bus, queries, starts, proofs, worktrees, output

    def handle(self, event: Moved[Process], logged: LoggedEvent) -> None:
        self.ended(event.row, logged)

    def ended(self, process: Process, logged: LoggedEvent) -> None:
        if process.ended_at is None:
            return
        proofs = [proof for proof in self.proofs.test_rows() if proof.process_id == process.id and proof.state is ProofState.RUNNING]
        if proofs:
            failed_ids = self.failed_proof_ids(process, proofs)
            for proof in proofs:
                self.bus.run(RecordWorkerTest(proof.id, proof.id not in failed_ids, ENDED_RUN_NOTE.format(process=process.id)), Actor.core(), cause_id=logged.id)
            self.starts.start_next(logged)
        elif process.category is CommandCategory.TEST_RUN and not process.succeeded:
            self.record_failed_run(process, logged)
        first_answer = self.queries.query(AffectedTest).filter(process_id=process.id).matching(Among("state", (AffectedTestState.PICKING, AffectedTestState.TESTING))).first()
        if first_answer is not None:
            self.bus.run(RecordAffectedTest(first_answer.id, process.id, process.succeeded), Actor.core(), cause_id=logged.id)

    # a run several proofs shared fails only the proofs whose files its failures name; a failure that names none of
    # them, such as a run that could not start, fails them all
    def failed_proof_ids(self, process: Process, proofs: list[Proof]) -> frozenset[int]:
        if process.succeeded:
            return frozenset()
        if len(proofs) == 1:
            return frozenset({proofs[0].id})
        failures = ProofTestCommand.failure_text(self.output.end_text(process.id, FAILURES_END_BYTES))
        named = frozenset(proof.id for proof in proofs if ProofTestCommand.parsed(proof.test_command).is_named_in(failures))
        return named or frozenset(proof.id for proof in proofs)

    def record_failed_run(self, process: Process, logged: LoggedEvent) -> None:
        worktree = self.worktrees.worker_worktree(process.session_agent_id)
        if worktree is not None:
            self.bus.run(RecordOwnTestFailure(process.session_agent_id, worktree.task_id, process.line), Actor.core(), cause_id=logged.id)

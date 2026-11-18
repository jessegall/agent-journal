from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.proof_test_command import ProofTestCommand
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from suites.coding.modules.workers.listeners.support.worker_test_starts import WorkerTestStarts

QUEUED_EVENT = "proof.queue"
SHARED_RUN_REASON = "the proofs one worktree runs together share one run, a handful at a time"


class WorkerTestListener(CommitListener[Moved[Proof]]):
    """Moves a worker's proof tests along: a queued test starts when there is room, and a test moved to running
    is launched. It runs in the urgent round, so a launch never waits behind the other events (report 1441)."""

    name = "workers.tests"
    run_order = -1
    moves = [ProofLifecycle.queue, ProofLifecycle.run]

    def __init__(self, starts: WorkerTestStarts, launch: WorkerTestLaunch, rows: EventRows, queries: Queries) -> None:
        self.starts, self.launch, self.rows, self.queries = starts, launch, rows, queries

    def handle(self, event: Moved[Proof], logged: LoggedEvent) -> None:
        if logged.event == QUEUED_EVENT:
            self.starts.start_next(logged)
            return
        proof = event.row
        if proof.process_id is None:
            return
        # a run several proofs share is launched once, by the first of them, with the command over all their files
        sharers = tuple(self.queries.query(Proof).filter(process_id=proof.process_id).oldest().every_row(SHARED_RUN_REASON))
        if sharers and sharers[0].id != proof.id:
            return
        process = self.rows.required(Process, proof.process_id)
        command = ProofTestCommand.combined([row.test_command for row in sharers] or [proof.test_command])
        self.launch.start(process, command, self.rows.required(Agent, process.session_agent_id).session)

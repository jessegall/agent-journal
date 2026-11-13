from engine.event.logged_event import LoggedEvent
from engine.event.moved import Moved
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from suites.coding.modules.workers.listeners.support.worker_test_starts import WorkerTestStarts

QUEUED_EVENT = "proof.queue"


class WorkerTestListener(CommitListener[Moved[Proof]]):
    """Moves a worker's proof tests along: a queued test starts when there is room, and a test moved to running
    is launched."""

    name = "workers.tests"
    moves = [ProofLifecycle.queue, ProofLifecycle.run]

    def __init__(self, starts: WorkerTestStarts, launch: WorkerTestLaunch, rows: EventRows) -> None:
        self.starts, self.launch, self.rows = starts, launch, rows

    def handle(self, event: Moved[Proof], logged: LoggedEvent) -> None:
        if logged.event == QUEUED_EVENT:
            self.starts.start_next(logged)
            return
        proof = event.row
        if proof.process_id is None:
            return
        process = self.rows.required(Process, proof.process_id)
        self.launch.start(process, proof.test_command, self.rows.required(Agent, process.session_agent_id).session)

from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import RecordWorkerTest
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch

QUEUED_EVENT, RUN_EVENT = "proof.queue", "proof.run"


class WorkerTestListener(CommitListener):
    """Moves a worker's tests along: a queued test starts when there is room, a test moved
    to running is launched, and a test whose process ended is recorded, which makes room for the next."""

    name = "workers.tests"
    event = "*.*"

    def __init__(self, bus: Bus, queries: Queries, launch: WorkerTestLaunch) -> None:
        self.bus, self.queries, self.launch = bus, queries, launch

    def handle(self, event: LoggedEvent) -> None:
        if event.event == QUEUED_EVENT:
            self.start_next(self.queries.query(Worktree).find(self.queries.query(Proof).find(event.row_id).worktree_id).environment_id, event)
        elif event.event == RUN_EVENT:
            self.launched(self.queries.query(Proof).find(event.row_id))
        elif event.row_table == "processes":
            self.ended(self.queries.query(Process).find(event.row_id), event)

    def start_next(self, environment_id: int, event: LoggedEvent) -> None:
        self.bus.run(StartWorkerTests(environment_id), Actor.core(), cause_id=event.id, environment_id=environment_id)

    def launched(self, proof: Proof) -> None:
        if proof.process_id is None:
            return
        process = self.queries.query(Process).find(proof.process_id)
        self.launch.start(process.id, proof.test_command, process.folder, self.queries.query(Agent).find(process.agent_id).session)

    def ended(self, process: Process, event: LoggedEvent) -> None:
        if process.ended_at is None:
            return
        proofs = self.queries.query(Proof).filter(process_id=process.id, state=ProofState.RUNNING).page(1, 1).rows
        if proofs:
            passed = process.state is ProcessState.FINISHED and process.exit_code == 0
            self.bus.run(RecordWorkerTest(proofs[0].id, passed, f"failed: journal output read of process {process.id}"), Actor.core(), cause_id=event.id, environment_id=process.environment_id)
            self.start_next(process.environment_id, event)

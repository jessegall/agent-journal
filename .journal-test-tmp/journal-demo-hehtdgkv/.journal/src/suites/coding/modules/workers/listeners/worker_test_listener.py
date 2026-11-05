from core.base.actor import Actor
from core.base.change.logged_event import LoggedEvent
from core.base.change.changed import Changed
from core.base.change.created import Created
from core.base.change.moved import Moved
from core.base.change.updated import Updated
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.base.query.conditions.among import Among
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import RecordWorkerTest
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.commands.queue_worker_tests.record_affected_test import RecordAffectedTest
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle

QUEUED_EVENT, RUN_EVENT = "proof.queue", "proof.run"


class WorkerTestListener(CommitListener[Moved[Proof] | Changed[Process] | Created[AffectedTest] | Updated[AffectedTest]]):
    """Moves a worker's tests along: a queued test starts when there is room, a test moved
    to running is launched, and a test whose process ended is recorded, which makes room for the next."""

    name = "workers.tests"
    moves = [ProofLifecycle.queue, ProofLifecycle.run]

    def __init__(self, bus: Bus, queries: Queries, launch: WorkerTestLaunch) -> None:
        self.bus, self.queries, self.launch = bus, queries, launch

    def handle(self, event: Moved[Proof] | Changed[Process] | Created[AffectedTest] | Updated[AffectedTest], logged: LoggedEvent) -> None:
        if logged.event == QUEUED_EVENT:
            self.start_next(self.queries.query(Worktree).find(event.row.worktree_id).environment_id, logged)
            return
        if logged.event == RUN_EVENT:
            self.launched(event.row)
            return
        if logged.row_table == "processes":
            self.ended(event.row, logged)
            return
        selected = event.row
        if logged.event == "affected_test.create":
            self.start_next(self.queries.query(Worktree).find(selected.worktree_id).environment_id, logged)
            return
        if selected.state not in (AffectedTestState.PICKING, AffectedTestState.TESTING) or selected.process_id is None:
            return
        process = self.queries.query(Process).find(selected.process_id)
        self.launch.start(process.id, process.line, process.folder, self.queries.query(Agent).find(process.agent_id).session)

    def start_next(self, environment_id: int, logged: LoggedEvent) -> None:
        self.bus.run(StartWorkerTests(environment_id), Actor.core(), cause_id=logged.id, environment_id=environment_id)

    def launched(self, proof: Proof) -> None:
        if proof.process_id is None:
            return
        process = self.queries.query(Process).find(proof.process_id)
        self.launch.start(process.id, proof.test_command, process.folder, self.queries.query(Agent).find(process.agent_id).session)

    def ended(self, process: Process, logged: LoggedEvent) -> None:
        if process.ended_at is None:
            return
        proofs = self.queries.query(Proof).filter(process_id=process.id, state=ProofState.RUNNING).limited(1)
        if proofs:
            passed = process.state is ProcessState.FINISHED and process.exit_code == 0
            self.bus.run(RecordWorkerTest(proofs[0].id, passed, f"failed: journal output read of process {process.id}"), Actor.core(), cause_id=logged.id, environment_id=process.environment_id)
            self.start_next(process.environment_id, logged)
        selected = self.queries.query(AffectedTest).filter(process_id=process.id).matching(Among("state", (AffectedTestState.PICKING, AffectedTestState.TESTING))).limited(1)
        if selected:
            passed = process.state is ProcessState.FINISHED and process.exit_code == 0
            self.bus.run(RecordAffectedTest(selected[0].id, process.id, passed), Actor.core(), cause_id=logged.id, environment_id=process.environment_id)

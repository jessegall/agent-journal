from engine.enums.command_category import CommandCategory
from suites.coding.modules.workers.commands.record_own_test_failure.record_own_test_failure import RecordOwnTestFailure
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from engine.actor.actor import Actor
from engine.event.logged_event import LoggedEvent
from engine.event.created import Created
from engine.event.moved import Moved
from engine.event.updated import Updated
from engine.command.bus import Bus
from engine.listener.commit.commit_listener import CommitListener
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from core.modules.agents.models.agent import Agent
from core.modules.processes.models.enums.process_state import ProcessState
from core.modules.processes.models.process import Process
from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import RecordWorkerTest
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_test_launch import WorkerTestLaunch
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.models.enums.affected_test_state import AffectedTestState
from suites.coding.modules.workers.commands.queue_worker_tests.record_affected_test import RecordAffectedTest
from suites.coding.modules.workers.models.lifecycles.proof_lifecycle import ProofLifecycle

QUEUED_EVENT, RUN_EVENT = "proof.queue", "proof.run"


class WorkerTestListener(CommitListener[Moved[Proof] | Moved[Process] | Created[AffectedTest] | Updated[AffectedTest]]):
    """Moves a worker's tests along: a queued test starts when there is room, a test moved
    to running is launched, and a test whose process ended is recorded, which makes room for the next."""

    name = "workers.tests"
    moves = [ProofLifecycle.queue, ProofLifecycle.run, ProcessLifecycle.finish, ProcessLifecycle.fail, ProcessLifecycle.stop, ProcessLifecycle.orphan]

    def __init__(self, bus: Bus, queries: Queries, launch: WorkerTestLaunch, rows: EventRows, proofs: ProofQuery, worktrees: WorktreeQuery) -> None:
        self.bus, self.queries, self.launch = bus, queries, launch
        self.rows, self.proofs, self.worktrees = rows, proofs, worktrees

    def handle(self, event: Moved[Proof] | Moved[Process] | Created[AffectedTest] | Updated[AffectedTest], logged: LoggedEvent) -> None:
        if logged.event == QUEUED_EVENT:
            self.start_next(logged)
            return
        row = event.row
        if logged.event == RUN_EVENT:
            if isinstance(row, Proof):
                self.launched(row)
            return
        if logged.row_table == "processes":
            if isinstance(row, Process):
                self.ended(row, logged)
            return
        if logged.event == "affected_test.create":
            self.start_next(logged)
            return
        if not isinstance(row, AffectedTest) or row.state not in (AffectedTestState.PICKING, AffectedTestState.TESTING) or row.process_id is None:
            return
        process = self.rows.required(Process, row.process_id)
        self.launch.start(process, process.line, self.rows.required(Agent, process.session_agent_id).session)

    def start_next(self, logged: LoggedEvent) -> None:
        self.bus.run(StartWorkerTests(), Actor.core(), cause_id=logged.id)

    def launched(self, proof: Proof) -> None:
        if proof.process_id is None:
            return
        process = self.rows.required(Process, proof.process_id)
        self.launch.start(process, proof.test_command, self.rows.required(Agent, process.session_agent_id).session)

    def ended(self, process: Process, logged: LoggedEvent) -> None:
        if process.ended_at is None:
            return
        proofs = [proof for proof in self.proofs.test_rows() if proof.process_id == process.id and proof.state is ProofState.RUNNING]
        if proofs:
            passed = process.state is ProcessState.FINISHED and process.exit_code == 0
            self.bus.run(RecordWorkerTest(proofs[0].id, passed, f"failed: journal output read of process {process.id}"), Actor.core(), cause_id=logged.id)
            self.start_next(logged)
        elif process.category is CommandCategory.TEST_RUN and (process.state is not ProcessState.FINISHED or process.exit_code != 0):
            self.record_failed_run(process, logged)
        first_answer = self.queries.query(AffectedTest).filter(process_id=process.id).matching(Among("state", (AffectedTestState.PICKING, AffectedTestState.TESTING))).first()
        if first_answer is not None:
            passed = process.state is ProcessState.FINISHED and process.exit_code == 0
            self.bus.run(RecordAffectedTest(first_answer.id, process.id, passed), Actor.core(), cause_id=logged.id)

    def record_failed_run(self, process: Process, logged: LoggedEvent) -> None:
        worktree = self.worktrees.worker_worktree(process.session_agent_id)
        if worktree is not None:
            self.bus.run(RecordOwnTestFailure(process.session_agent_id, worktree.task_id, process.line), Actor.core(), cause_id=logged.id)

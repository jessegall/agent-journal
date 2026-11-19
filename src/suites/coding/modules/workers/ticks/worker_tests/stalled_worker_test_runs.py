from engine.ticker.tick_handler import TIMED_JOB_REASON
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from core.modules.plans.support.checkpoint_run_start import CheckpointRunStart
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.plan import Plan
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.record_checkpoint_test.record_checkpoint_test import RecordCheckpointTest
from suites.coding.modules.workers.commands.queue_worker_tests.end_stalled_proof_run import EndStalledProofRun
from suites.coding.modules.workers.commands.queue_worker_tests.queue_stalled_tests import QueueStalledTests
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import ENDED_RUN_NOTE, REMOVED_RUN_NOTE, RecordWorkerTest
from suites.coding.modules.workers.listeners.support.worker_test_starts import WorkerTestStarts
from suites.coding.modules.workers.models.checkpoint_test import RUNNING_STATES, CheckpointTest
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_settings import HUNG_PROOF_RUN_MINUTES

STALLED_RUNS_REASON = "the run of every proof still shown as running is looked at"
RUNNING_CHECKPOINT_TESTS_REASON = "every test of a checkpoint run still shown as running is looked at"
STARTED_PLANS_REASON = "every started plan is looked at for a checkpoint run that has no tests"
CHECKPOINT_RUNS_REASON = "the runs and checkpoints of those tests are read in one query each"
ENDED_GRACE_SECONDS = 60


class StalledWorkerTestRuns:
    """Every minute, tests no run holds are moved along: a running test whose process ended a minute ago
    with nothing recorded, or whose process is gone, is recorded from how it ended or as lost; a proof of a
    task in testing whose test nothing queued, as after a proof edit, is queued, or committed in a started
    plan; and a queued test a server update left behind is started, also one of a merged worktree, which
    its plan's checkpoint runs. A test that has run longer than the stuck limit, whatever its process is
    doing, is ended and recorded as failed, and the worker and the merger are told. A test of a checkpoint
    run whose process is gone, or ended a minute ago unheard, is recorded the same way."""

    def __call__(self, container: Container) -> None:
        bus = container.get(Bus)
        worktrees = container.get(WorktreeQuery)
        environments = {worktree.id: worktree.environment_id for worktree in worktrees.open_worktrees()}
        self.record_ended(container, [proof for proof in container.get(ProofQuery).test_rows() if proof.state is ProofState.RUNNING and proof.worktree_id in environments], environments)
        bus.run(QueueStalledTests(), Actor.core())
        worktree_environments = {worktree.id: worktree.environment_id for worktree in worktrees.all_worktrees()}
        queued = {worktree_environments[proof.worktree_id] for proof in container.get(ProofQuery).queued_tests(worktree_environments)}
        for environment_id in queued:
            container.get(WorkerTestStarts).start_in(environment_id)
        self.start_reaches_with_no_tests(container)
        # last, so a checkpoint test that cannot be recorded never holds the proofs of other workers back
        self.record_ended_checkpoint_tests(container)

    # A reach that runs with no test behind it, its tests never made, is started again: the run of a started plan starts its
    # oldest running reach, which does nothing for a run that has tests, and ends the reach when the run has none to make.
    @staticmethod
    def start_reaches_with_no_tests(container: Container) -> None:
        for plan in container.get(Queries).query(Plan).all_environments(TIMED_JOB_REASON).filter(state=PlanState.STARTED).every_row(STARTED_PLANS_REASON):
            container.get(CheckpointRunStart).start(plan.id, plan.environment_id)

    @staticmethod
    def record_ended(container: Container, running: list[Proof], environments: dict[int, int]) -> None:
        if not running:
            return
        current = container.get(Clock).timestamp()
        hung_minutes = int(container.get(SettingValues).number(HUNG_PROOF_RUN_MINUTES))
        hung_seconds = hung_minutes * 60
        processes = {process.id: process for process in container.get(Queries).query(Process).all_environments(TIMED_JOB_REASON).matching(Among("id", [proof.process_id for proof in running])).every_row(STALLED_RUNS_REASON)}
        for proof in running:
            process = processes.get(proof.process_id)
            if process is None:
                record = RecordWorkerTest(proof.id, False, REMOVED_RUN_NOTE.format(process=proof.process_id))
            elif process.ended_at is not None and process.ended_at.elapsed_seconds(current) > ENDED_GRACE_SECONDS:
                record = RecordWorkerTest(proof.id, process.succeeded, ENDED_RUN_NOTE.format(process=process.id))
            elif proof.update_timestamp().elapsed_seconds(current) >= hung_seconds:
                record = EndStalledProofRun(proof.id, hung_minutes)
            else:
                continue
            container.get(Bus).run(record, Actor.core(), environment_id=environments[proof.worktree_id])

    @staticmethod
    def record_ended_checkpoint_tests(container: Container) -> None:
        queries = container.get(Queries)
        running = list(queries.query(CheckpointTest).matching(Among("state", RUNNING_STATES)).every_row(RUNNING_CHECKPOINT_TESTS_REASON))
        if not running:
            return
        current = container.get(Clock).timestamp()
        processes = {process.id: process for process in queries.query(Process).all_environments(TIMED_JOB_REASON).matching(Among("id", [test.process_id for test in running])).every_row(CHECKPOINT_RUNS_REASON)}
        reaches = {reach.id: reach for reach in queries.query(CheckpointReach).all_environments(TIMED_JOB_REASON).matching(Among("id", [test.reach_id for test in running])).every_row(CHECKPOINT_RUNS_REASON)}
        for test in running:
            process = processes.get(test.process_id)
            if process is not None and (process.ended_at is None or process.ended_at.elapsed_seconds(current) <= ENDED_GRACE_SECONDS):
                continue
            container.get(Bus).run(RecordCheckpointTest(test.id, process is not None and process.succeeded), Actor.core(), environment_id=reaches[test.reach_id].environment_id)

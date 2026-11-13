from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.setting.setting_values import SettingValues
from engine.time.clock import Clock
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.commands.queue_worker_tests.end_stalled_proof_run import EndStalledProofRun
from suites.coding.modules.workers.commands.queue_worker_tests.queue_stalled_tests import QueueStalledTests
from suites.coding.modules.workers.commands.queue_worker_tests.record_worker_test import ENDED_RUN_NOTE, REMOVED_RUN_NOTE, RecordWorkerTest
from suites.coding.modules.workers.commands.queue_worker_tests.start_worker_tests import StartWorkerTests
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_settings import HUNG_PROOF_RUN_MINUTES

STALLED_RUNS_REASON = "the run of every proof still shown as running is looked at"
ENDED_GRACE_SECONDS = 60


class StalledWorkerTestRuns:
    """Every minute, tests no run holds are moved along: a running test whose process ended a minute ago with
    nothing recorded, or whose process is gone, is recorded from how it ended or as lost; a proof of a task in
    testing whose test nothing queued, as after a proof edit, is queued, or committed in a started plan; and a
    queued test a server update left behind is started. A test that has run longer than the stuck limit,
    whatever its process is doing, is ended and recorded as failed, and the worker and the merger are told."""

    def __call__(self, container: Container) -> None:
        bus = container.get(Bus)
        environments = {worktree.id: worktree.environment_id for worktree in container.get(WorktreeQuery).all_worktrees()}
        self.record_ended(container, [proof for proof in container.get(ProofQuery).test_rows() if proof.state is ProofState.RUNNING and proof.worktree_id in environments], environments)
        bus.run(QueueStalledTests(), Actor.core())
        queued = {environments[proof.worktree_id] for proof in container.get(ProofQuery).test_rows() if proof.state is ProofState.QUEUED and proof.worktree_id in environments}
        for environment_id in queued:
            bus.run(StartWorkerTests(), Actor.core(), environment_id=environment_id)

    @staticmethod
    def record_ended(container: Container, running: list[Proof], environments: dict[int, int]) -> None:
        if not running:
            return
        current = container.get(Clock).timestamp()
        hung_minutes = int(container.get(SettingValues).number(HUNG_PROOF_RUN_MINUTES))
        hung_seconds = hung_minutes * 60
        processes = {process.id: process for process in container.get(Queries).query(Process).matching(Among("id", [proof.process_id for proof in running])).every_row(STALLED_RUNS_REASON)}
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

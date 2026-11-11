from engine.command.bus import Bus
from engine.command.context import Context
from engine.listener.event_rows import EventRows
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plans.commands.fail_checkpoint.fail_checkpoint import FailCheckpoint
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.lifecycles.checkpoint_lifecycle import CheckpointLifecycle
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.plan_checkpoints import PlanCheckpoints
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.models.checkpoint_test import RUNNING_STATES, CheckpointTest
from suites.coding.modules.workers.models.enums.proof_state import TEST_WAITING_STATES, ProofState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.checkpoint_failures import CheckpointFailures
from suites.coding.modules.workers.support.phase_test_deferrals import PhaseTestDeferrals


class CheckpointResults:
    """Ends the run of a reached checkpoint once none of its tests waits or runs: the proofs of its window,
    the checkpoint's own test and the selected run. When every one passed, the reach is passed, which opens
    the phases after it; otherwise it is failed with the tasks its failures belong to. A run with no test
    passes at once. A result that comes in for a cancelled plan ends no run."""

    def __init__(self, proofs: ProofQuery, queries: Queries, repository: Repository, bus: Bus, checkpoints: PlanCheckpoints, plans: TaskPlans, rows: EventRows, failures: CheckpointFailures, deferrals: PhaseTestDeferrals) -> None:
        self.failures, self.deferrals = failures, deferrals
        self.proofs, self.queries, self.repository, self.bus = proofs, queries, repository, bus
        self.checkpoints, self.plans, self.rows = checkpoints, plans, rows

    def record(self, task_id: int, context: Context) -> None:
        phase = self.plans.find_phase(task_id)
        if phase is None:
            return
        running = [reach for reach in self.checkpoints.reaches(phase.plan_id) if reach.state is CheckpointState.RUNNING and task_id in reach.tasks()]
        if running:
            self.finish(running[0], context)

    def finish(self, reach: CheckpointReach, context: Context) -> None:
        if self.rows.required(Plan, reach.plan_id).state is PlanState.CANCELLED:
            return
        proofs, tests = self.proofs.task_proofs(reach.tasks()), self.tests(reach)
        if any(proof.state in TEST_WAITING_STATES for proof in proofs) or any(test.state in RUNNING_STATES for test in tests):
            return
        failed_task_ids = self.failures.read(reach, proofs, tests).task_ids
        if failed_task_ids:
            self.bus.dispatch(FailCheckpoint(reach.id, failed_task_ids=",".join(str(task_id) for task_id in failed_task_ids)), context)
            return
        if not reach.is_early:
            self.deferrals.close_due(reach.phase_id, context)
        self.repository.save_change(reach, reach.moved(CheckpointLifecycle.passed), context)

    def is_started(self, reach: CheckpointReach) -> bool:
        return bool(self.tests(reach)) or any(proof.state in TEST_WAITING_STATES for proof in self.proofs.task_proofs(reach.tasks()))

    def running_process_ids(self, reach: CheckpointReach) -> tuple[int, ...]:
        proof_processes = [proof.process_id for proof in self.proofs.task_proofs(reach.tasks()) if proof.state is ProofState.RUNNING and proof.process_id is not None]
        return tuple([*proof_processes, *(test.process_id for test in self.tests(reach) if test.state in RUNNING_STATES)])

    def tests(self, reach: CheckpointReach) -> tuple[CheckpointTest, ...]:
        return tuple(self.queries.query(CheckpointTest).filter(reach_id=reach.id).oldest().all_rows())

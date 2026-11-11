from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plans.models.checkpoint_pass import CheckpointPass
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_reach_source import CheckpointReachSource
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.checkpoint_branch_moves import CheckpointBranchMoves
from core.modules.plans.support.checkpoint_windows import CheckpointWindows
from core.modules.plans.support.early_run import EarlyRun

WINDOW_REASON = "The checkpoints of one plan are worked out from every task of that plan."


class PlanCheckpoints:
    """Reads the checkpoints of a plan and records what happens at them. A window that is reached gets a reach
    for its run, one at a time, with the completed tasks it had then; a reached window with no completed task
    has nothing to run and passes at once. A window whose run failed is reached again once its tasks are all
    completed again, and gets a new reach. The core runs no test: a suite ends the run of a reach. The last
    phase of a plan is always a checkpoint, so a plan is over once that one has passed. A window whose worker run
    passed with the same tasks passes at the merge with no new run, unless it is the plan's last window and the
    branch moved after the worker's commit."""

    def __init__(self, queries: Queries, repository: Repository, moves: CheckpointBranchMoves) -> None:
        self.queries, self.repository, self.moves = queries, repository, moves

    def windows(self, plan_id: int) -> CheckpointWindows:
        phases = tuple(self.queries.query(Phase).filter(plan_id=plan_id).ordered("position").all_rows())
        places = tuple(self.queries.query(PlanTask).filter(plan_id=plan_id).full_table(WINDOW_REASON).all_rows())
        return CheckpointWindows(phases, places)

    def reaches(self, plan_id: int) -> tuple[CheckpointReach, ...]:
        return tuple(self.queries.query(CheckpointReach).filter(plan_id=plan_id).oldest().all_rows())

    def status_lines(self, plan_id: int, windows: CheckpointWindows) -> tuple[str, ...]:
        newest = {reach.phase_id: reach for reach in self.reaches(plan_id)}
        return windows.status_lines(newest, self.passed_phase_ids(plan_id))

    def passed_phase_ids(self, plan_id: int) -> frozenset[int]:
        return frozenset(passed.phase_id for passed in self.queries.query(CheckpointPass).filter(plan_id=plan_id).all_rows())

    def is_end_passed(self, plan_id: int) -> bool:
        return self.windows(plan_id).is_end_passed(self.passed_phase_ids(plan_id))

    def record(self, plan_id: int, context: Context) -> None:
        windows = self.windows(plan_id)
        if not windows.phases:
            return
        reaches = self.reaches(plan_id)
        running_phase_ids = self.running_phase_ids(reaches)
        run_tasks = {reach.phase_id: reach.tasks() for reach in reaches if reach.source.opens_phases() and reach.state is not CheckpointState.FAILED}
        passed = self.passed_phase_ids(plan_id)
        last_id = windows.checkpoint_phases()[-1].id
        for checkpoint in windows.checkpoint_phases():
            if not windows.is_reached(checkpoint) or checkpoint.id in running_phase_ids:
                continue
            completed = windows.completed_ids(checkpoint)
            worker_pass = self.worker_pass(reaches, checkpoint.id, completed)
            if worker_pass is not None and not (checkpoint.id == last_id and self.moves.moved_after(worker_pass)):
                if checkpoint.id not in passed:
                    self.save_pass(plan_id, checkpoint.id, context)
                continue
            if not completed and checkpoint.id not in passed:
                self.repository.save(CheckpointPass(creator_id=context.actor.id, plan_id=plan_id, phase_id=checkpoint.id, passed_at=context.timestamp), context)
            if completed and run_tasks.get(checkpoint.id) != completed:
                self.repository.save(CheckpointReach.started(context.actor.id, plan_id, checkpoint.id, completed), context)

    @staticmethod
    def worker_pass(reaches: tuple[CheckpointReach, ...], phase_id: int, completed: tuple[int, ...]) -> CheckpointReach | None:
        worker_reaches = [reach for reach in reaches if reach.phase_id == phase_id and reach.source is CheckpointReachSource.WORKER]
        newest = worker_reaches[-1] if worker_reaches else None
        if newest is None or newest.state is not CheckpointState.PASSED or set(newest.tasks()) != set(completed):
            return None
        return newest

    def run_early(self, plan_id: int, context: Context) -> EarlyRun:
        windows = self.windows(plan_id)
        running_phase_ids = self.running_phase_ids(self.reaches(plan_id))
        for checkpoint in windows.checkpoint_phases() if windows.phases else ():
            testing = windows.testing_ids(checkpoint)
            if testing and checkpoint.id not in running_phase_ids:
                self.repository.save(CheckpointReach.started_early(context.actor.id, plan_id, checkpoint.id, testing), context)
                return EarlyRun(checkpoint.id, testing)
        return EarlyRun()

    def reach_worker(self, plan_id: int, phase_id: int, task_ids: tuple[int, ...], context: Context) -> CheckpointReach | None:
        if phase_id in self.running_phase_ids(self.reaches(plan_id)):
            return None
        return self.repository.save(CheckpointReach.started_worker(context.actor.id, plan_id, phase_id, task_ids), context)

    @staticmethod
    def running_phase_ids(reaches: tuple[CheckpointReach, ...]) -> frozenset[int]:
        return frozenset(reach.phase_id for reach in reaches if reach.state is CheckpointState.RUNNING)

    def save_pass(self, plan_id: int, phase_id: int, context: Context) -> bool:
        if self.queries.query(CheckpointPass).filter(plan_id=plan_id, phase_id=phase_id).exists():
            return False
        self.repository.save(CheckpointPass(creator_id=context.actor.id, plan_id=plan_id, phase_id=phase_id, passed_at=context.timestamp), context)
        return True

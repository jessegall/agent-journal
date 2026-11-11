from engine.command.context import Context
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plans.models.checkpoint_pass import CheckpointPass
from core.modules.plans.models.checkpoint_reach import CheckpointReach
from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.plans.support.checkpoint_windows import CheckpointWindows

WINDOW_REASON = "The checkpoints of one plan are worked out from every task of that plan."


class PlanCheckpoints:
    """Reads the checkpoints of a plan and records what happens at them. A window that is reached gets a reach
    for its run, one at a time, with the completed tasks it had then; a reached window with no completed task
    has nothing to run and passes at once. The core runs no test: a suite ends the run of a reach."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def windows(self, plan_id: int) -> CheckpointWindows:
        phases = tuple(self.queries.query(Phase).filter(plan_id=plan_id).ordered("position").all_rows())
        places = tuple(self.queries.query(PlanTask).filter(plan_id=plan_id).full_table(WINDOW_REASON).all_rows())
        return CheckpointWindows(phases, places)

    def reaches(self, plan_id: int) -> tuple[CheckpointReach, ...]:
        return tuple(self.queries.query(CheckpointReach).filter(plan_id=plan_id).oldest().all_rows())

    def status_lines(self, plan_id: int, windows: CheckpointWindows) -> tuple[str, ...]:
        newest_states = {reach.phase_id: reach.state for reach in self.reaches(plan_id)}
        return windows.status_lines(newest_states, self.passed_phase_ids(plan_id))

    def passed_phase_ids(self, plan_id: int) -> frozenset[int]:
        return frozenset(passed.phase_id for passed in self.queries.query(CheckpointPass).filter(plan_id=plan_id).all_rows())

    def record(self, plan_id: int, context: Context) -> None:
        windows = self.windows(plan_id)
        if not windows.phases:
            return
        newest = {reach.phase_id: reach for reach in self.reaches(plan_id)}
        passed = self.passed_phase_ids(plan_id)
        for checkpoint in windows.checkpoint_phases():
            if windows.is_reached(checkpoint):
                self.record_reached(checkpoint, windows.completed_ids(checkpoint), newest.get(checkpoint.id), checkpoint.id in passed, context)

    def record_reached(self, checkpoint: Phase, completed: tuple[int, ...], newest: CheckpointReach | None, is_passed: bool, context: Context) -> None:
        if not completed and not is_passed:
            self.repository.save(CheckpointPass(creator_id=context.actor.id, plan_id=checkpoint.plan_id, phase_id=checkpoint.id, passed_at=context.timestamp), context)
        if completed and (newest is None or (newest.state is not CheckpointState.RUNNING and newest.tasks() != completed)):
            self.repository.save(CheckpointReach.started(context.actor.id, checkpoint.plan_id, checkpoint.id, completed), context)

    def save_pass(self, plan_id: int, phase_id: int, context: Context) -> bool:
        if self.queries.query(CheckpointPass).filter(plan_id=plan_id, phase_id=phase_id).exists():
            return False
        self.repository.save(CheckpointPass(creator_id=context.actor.id, plan_id=plan_id, phase_id=phase_id, passed_at=context.timestamp), context)
        return True

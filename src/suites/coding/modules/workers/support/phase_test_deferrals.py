from engine.command.context import Context
from engine.listener.event_rows import EventRows
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.plans.models.phase import Phase
from suites.coding.modules.workers.models.phase_test_deferral import PhaseTestDeferral
from suites.coding.modules.workers.support.own_test import OwnTest
from suites.coding.modules.workers.support.own_test_command import OwnTestCommand


class PhaseTestDeferrals:
    """Reads the deferrals of a checkpoint phase and builds the test commands its run makes with them: the
    phase's own command without the paths left out of it, with the paths that are due at this phase added.
    A due phase with no command of its own runs the due paths with the command of the phase they came from,
    so no path is lost. A deferral is closed when the run of its due phase passed."""

    def __init__(self, queries: Queries, repository: Repository, rows: EventRows) -> None:
        self.queries, self.repository, self.rows = queries, repository, rows

    def count(self, phase_id: int) -> int:
        return self.queries.query(PhaseTestDeferral).filter(phase_id=phase_id).count()

    def left_out(self, phase_id: int) -> tuple[PhaseTestDeferral, ...]:
        return tuple(self.queries.query(PhaseTestDeferral).filter(phase_id=phase_id).matching(IsNull("closed_at")).oldest().all_rows())

    def due(self, phase_id: int) -> tuple[PhaseTestDeferral, ...]:
        return tuple(self.queries.query(PhaseTestDeferral).filter(due_phase_id=phase_id).matching(IsNull("closed_at")).oldest().all_rows())

    def run_commands(self, phase: Phase) -> tuple[str, ...]:
        due = self.due(phase.id)
        if not phase.test_command:
            source_phases = self.rows.required_by_id(Phase, sorted({deferral.phase_id for deferral in due}))
            return tuple(OwnTestCommand.parse(source_phases[deferral.phase_id].test_command).with_paths(deferral.path_words()).text() for deferral in due)
        left_out_paths = tuple(path for deferral in self.left_out(phase.id) for path in deferral.path_words())
        due_paths = tuple(path for deferral in due for path in deferral.path_words())
        command = OwnTestCommand.parse(phase.test_command).without(left_out_paths).text() if left_out_paths else phase.test_command
        return tuple([OwnTest(command, due_paths).command])

    def close_due(self, phase_id: int, context: Context) -> None:
        for deferral in self.due(phase_id):
            self.repository.update(deferral, context, closed_at=context.timestamp)

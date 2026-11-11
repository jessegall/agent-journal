from collections.abc import Mapping
from dataclasses import dataclass

from core.modules.plans.models.enums.checkpoint_state import CheckpointState
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.models.enums.task_state import TaskState

FINISHED_STATES = (TaskState.COMPLETED, TaskState.CANCELLED)
STATUS_LINE = "checkpoint of phase {phase}: {status}"
GATE_LINE = "phase {phase} waits for the tests of phase {checkpoint}"


@dataclass(frozen=True)
class CheckpointWindows:
    """The checkpoints of one plan and the window of each: a checkpoint is a phase flagged as one, or the last
    phase of the plan; its window is the tasks placed after the checkpoint before it, up to and including its
    own. A window is reached when every task of it is completed or cancelled. It also says in plain lines how
    each checkpoint stands."""

    phases: tuple[Phase, ...]
    places: tuple[PlanTask, ...]

    def checkpoint_phases(self) -> tuple[Phase, ...]:
        return tuple(phase for phase in self.phases if phase.checkpoint or phase.id == self.phases[-1].id)

    def window_checkpoint(self, phase_id: int) -> Phase:
        position = next(phase.position for phase in self.phases if phase.id == phase_id)
        return next(phase for phase in self.checkpoint_phases() if phase.position >= position)

    def window(self, checkpoint: Phase) -> tuple[PlanTask, ...]:
        previous_positions = [phase.position for phase in self.checkpoint_phases() if phase.position < checkpoint.position]
        first_position = max(previous_positions, default=0) + 1
        window_places = [place for place in self.places if first_position <= place.phase_position <= checkpoint.position]
        return tuple(sorted(window_places, key=lambda place: (place.phase_position, place.position)))

    def is_reached(self, checkpoint: Phase) -> bool:
        return all(place.state in FINISHED_STATES for place in self.window(checkpoint))

    def completed_ids(self, checkpoint: Phase) -> tuple[int, ...]:
        return tuple(place.task_id for place in self.window(checkpoint) if place.state is TaskState.COMPLETED)

    def unfinished_ids(self, checkpoint: Phase) -> tuple[int, ...]:
        return tuple(place.task_id for place in self.window(checkpoint) if place.state not in FINISHED_STATES)

    def status(self, checkpoint: Phase, newest_state: CheckpointState | None, is_passed: bool) -> str:
        unfinished = self.unfinished_ids(checkpoint)
        if unfinished:
            return f"waits for tasks {', '.join(map(str, unfinished))}"
        if newest_state is CheckpointState.RUNNING:
            return "running"
        if newest_state is CheckpointState.FAILED:
            return "failed"
        return "passed" if is_passed else "reached"

    def status_lines(self, newest_states: Mapping[int, CheckpointState], passed_phase_ids: frozenset[int]) -> tuple[str, ...]:
        if not self.phases:
            return ()
        checkpoints = self.checkpoint_phases()
        lines = [STATUS_LINE.format(phase=phase.id, status=self.status(phase, newest_states.get(phase.id), phase.id in passed_phase_ids)) for phase in checkpoints]
        gate = next((phase for phase in checkpoints if phase.checkpoint and phase.id not in passed_phase_ids and self.window(phase)), None)
        if gate is None:
            return tuple(lines)
        return (*lines, *(GATE_LINE.format(phase=phase.id, checkpoint=gate.id) for phase in self.phases if phase.position > gate.position))

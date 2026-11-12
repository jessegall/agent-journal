from dataclasses import dataclass

from engine.database.statement import Statement
from core.modules.tasks.models.enums.task_state import UNFINISHED_STATES
from core.modules.tasks.models.open_dependency import OpenDependency


@dataclass(frozen=True)
class EarliestUnfinishedPhase:
    """Matches the places of any plan that are in the earliest phase of their own plan that still has an
    unfinished task waiting on no other task."""

    def statement(self) -> Statement:
        marks = ", ".join("?" for _ in UNFINISHED_STATES)
        return Statement("phase_position = (SELECT min(earliest.phase_position) FROM plan_tasks AS earliest"
                         f" WHERE earliest.plan_id = plan_tasks.plan_id AND earliest.state IN ({marks})"
                         f" AND earliest.task_id NOT IN (SELECT task_id FROM {OpenDependency.view}))", [state.value for state in UNFINISHED_STATES])

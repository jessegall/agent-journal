from dataclasses import dataclass

from core.base.database.statement import Statement
from core.modules.processes.support.run_visibility import VISIBLE_CATEGORIES
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.processes.models.enums.process_dock_type import ProcessDockType


@dataclass(frozen=True)
class LongRunCandidate:
    """Matches runs old enough to dock, together with runs already docked."""

    start_cutoff: str

    def statement(self) -> Statement:
        categories = ", ".join("?" for _ in VISIBLE_CATEGORIES)
        return Statement("((started_at < ? AND (creator_id != agent_id OR id IN "
                         f"(SELECT process_id FROM process_parts WHERE category IN ({categories})))) "
                         "OR id IN (SELECT target_id FROM dock_items "
                         "WHERE type = ? AND target_model = ? AND state = ?))",
                         [self.start_cutoff, *(category.value for category in VISIBLE_CATEGORIES),
                          ProcessDockType.OUTPUT.value, "process", DockItemState.DOCKED.value])

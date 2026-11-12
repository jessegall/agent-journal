from dataclasses import dataclass

from engine.database.statement import Statement
from engine.enums.command_category import CommandCategory
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.processes.models.enums.process_dock_type import ProcessDockType



FILE_CATEGORIES = tuple(category.value for category in CommandCategory if category.accesses_files)


@dataclass(frozen=True)
class LongRunCandidate:
    """Matches runs old enough to dock, together with runs already docked."""

    start_cutoff: str

    def statement(self) -> Statement:
        file_categories = ", ".join("?" for _ in FILE_CATEGORIES)
        return Statement("((started_at < ? AND (creator_id != session_agent_id OR EXISTS "
                         "(SELECT 1 FROM process_parts WHERE process_id = processes.id AND is_visible = 1) OR (moved_at > '' AND EXISTS "
                         f"(SELECT 1 FROM process_parts WHERE process_id = processes.id AND category NOT IN ({file_categories}))))) "
                         "OR id IN (SELECT target_id FROM dock_items "
                         "WHERE type = ? AND target_model = ? AND state = ?))",
                         [self.start_cutoff, *FILE_CATEGORIES, ProcessDockType.OUTPUT.value, "process", DockItemState.DOCKED.value])

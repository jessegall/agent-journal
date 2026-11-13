from dataclasses import dataclass

from engine.database.statement import Statement
from engine.enums.command_category import CommandCategory
from core.modules.docking.models.enums.dock_item_state import DockItemState
from core.modules.processes.models.enums.process_dock_type import ProcessDockType
from engine.query.conditions.less import Less
from engine.query.conditions.subquery_match import SubqueryMatch
from engine.query.conditions.equal import Equal
from engine.query.conditions.among import Among
from engine.query.conditions.exists import Exists
from engine.query.conditions.greater import Greater
from engine.query.conditions.any_of import AnyOf
from engine.query.conditions.all_of import AllOf
from engine.query.conditions.column_compare import ColumnCompare
from engine.query.select import Select



FILE_CATEGORIES = tuple(category.value for category in CommandCategory if category.accesses_files)


@dataclass(frozen=True)
class LongRunCandidate:
    """Matches runs old enough to dock, together with runs already docked."""

    start_cutoff: str

    def statement(self) -> Statement:
        parts = Select("process_parts").matching(ColumnCompare("process_id", "=", "processes.id"))
        moved_with_different_work = AllOf([Greater("moved_at", ""), Exists(parts.matching(Among("category", FILE_CATEGORIES, negated=True)))])
        old_enough = AllOf([Less("started_at", self.start_cutoff), AnyOf([ColumnCompare("creator_id", "!=", "session_agent_id"), Exists(parts.matching(Equal("is_visible", 1))), moved_with_different_work])])
        docked = Select("dock_items").matching(Equal("type", ProcessDockType.OUTPUT.value)).matching(Equal("target_model", "process")).matching(Equal("state", DockItemState.DOCKED.value))
        return AnyOf([old_enough, SubqueryMatch("id", docked.column("target_id"))]).statement()

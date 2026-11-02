from core.base.change.change import Change
from core.base.guard.guard import Guard
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.docking.models.dock_item import DockItem
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process


class EndedProcessDockGuard(Guard):
    """Refuses docking a process that has ended; its output stays readable."""

    name = "processes.ended-process-dock"
    event = "dock_item.*"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, change: Change[Model]) -> None:
        item = change.row
        if not isinstance(item, DockItem) or change.old_row is not None or item.target_model != Process.model_name:
            return
        if self.queries.query(Process).find(item.target_id).state not in RUNNING_STATES:
            raise Refusal(f"process {item.target_id} has ended, so it cannot be docked", f"read it with journal output read {item.target_id}")

from engine.guard.guard import Guard
from core.base.listener.event_rows import EventRows
from engine.errors.refusal import Refusal
from core.modules.docking.models.dock_item import DockItem
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.base.change.changed import Changed
from engine.command.context import Context


class EndedProcessDockGuard(Guard[Changed[DockItem]]):
    """Refuses docking a process that has ended; its output stays readable."""

    name = "processes.ended-process-dock"

    def __init__(self, rows: EventRows) -> None:
        self.rows = rows

    def check(self, event: Changed[DockItem], context: Context) -> None:
        item = event.row
        if event.old_row is not None or item.target_model != Process.model_name:
            return
        if self.rows.required(Process, item.target_id).state not in RUNNING_STATES:
            raise Refusal(f"process {item.target_id} has ended, so it cannot be docked", f"read it with journal output read {item.target_id}")

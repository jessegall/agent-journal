from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.change.logged_event import LoggedEvent
from core.modules.processes.listeners.process_mark_listener import ProcessMarkListener
from core.modules.processes.models.enums.part_state import PartState
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart


class ProcessPartStartMarkListener(ProcessMarkListener[Changed[ProcessPart]]):
    """A part that starts is the moment its run's chat mark first shows."""

    name = "processes.part-start-mark"

    def handle(self, event: Changed[ProcessPart], logged: LoggedEvent) -> None:
        if isinstance(event, Deleted) or event.row.state is not PartState.RUNNING or event.old_row is None or event.old_row.state is not PartState.WAITING:
            return
        process = self.rows.find(Process, event.row.process_id)
        if process is not None:
            self.show(process, logged)

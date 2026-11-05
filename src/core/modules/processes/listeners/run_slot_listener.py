from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.processes.models.process import Process
from core.modules.processes.support.run_slots import RunSlots
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class RunSlotListener(SaveListener[Changed[Process]]):
    """Rechecks admission when a process starts or ends."""

    name = "processes.run-slots"

    def __init__(self, slots: RunSlots) -> None:
        self.slots = slots

    def handle(self, event: Changed[Process], context: Context) -> None:
        if isinstance(event, Deleted):
            return
        run = event.row
        if isinstance(run, Process) and event.move is not None:
            self.slots.grant(run.environment_id, context)

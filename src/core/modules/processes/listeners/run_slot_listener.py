from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.modules.processes.models.process import Process
from core.modules.processes.support.run_slots import RunSlots


class RunSlotListener(SaveListener):
    """Rechecks admission when a process starts or ends."""

    name = "processes.run-slots"
    event = "process.*"

    def __init__(self, slots: RunSlots) -> None:
        self.slots = slots

    def handle(self, change: Change[Model]) -> None:
        run = change.new_row
        if isinstance(run, Process) and change.move is not None:
            self.slots.grant(run.environment_id, change.context)

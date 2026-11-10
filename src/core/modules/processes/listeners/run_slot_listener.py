from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from engine.change.moved import Moved
from engine.listener.save_listener import SaveListener
from core.modules.processes.models.process import Process
from core.modules.processes.support.run_slots import RunSlots
from engine.command.bus import Bus
from engine.command.context import Context
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots


class RunSlotListener(SaveListener[Moved[Process]]):
    """Rechecks admission when a process starts or ends."""

    name = "processes.run-slots"
    moves = ProcessLifecycle.moves()

    def __init__(self, slots: RunSlots, bus: Bus) -> None:
        self.slots, self.bus = slots, bus

    def handle(self, event: Moved[Process], context: Context) -> None:
        run = event.row
        self.slots.remember(run)
        self.bus.dispatch(GrantRunSlots(), context)

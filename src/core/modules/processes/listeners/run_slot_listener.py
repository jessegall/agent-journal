from core.modules.processes.models.lifecycles.process_lifecycle import ProcessLifecycle
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from core.modules.processes.models.process import Process
from core.modules.processes.support.run_slots import RunSlots
from engine.command.bus import Bus
from engine.command.context import Context
from engine.database.database import Database
from core.modules.processes.commands.grant_run_slots.grant_run_slots import GrantRunSlots


class RunSlotListener(SaveListener[Moved[Process]]):
    """Rechecks admission when a process that took part in the queue starts or ends; a request row that never
    waited for a place and held none frees nothing, so it grants nothing."""

    name = "processes.run-slots"
    moves = ProcessLifecycle.moves()

    def __init__(self, slots: RunSlots, bus: Bus, database: Database) -> None:
        self.slots, self.bus, self.database = slots, bus, database

    def handle(self, event: Moved[Process], context: Context) -> None:
        run = event.row
        self.slots.remember(run)
        # a move made while slots are granted is seen by that grant; granting again inside it only nests
        if not run.is_queue_member or self.database.is_running(GrantRunSlots.label()):
            return
        self.bus.dispatch(GrantRunSlots(), context)

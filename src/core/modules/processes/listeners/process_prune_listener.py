from core.modules.processes.events.output_ended import OutputEnded
from engine.command.bus import Bus
from engine.listener.save_listener import SaveListener
from engine.listener.rows.event_rows import EventRows
from core.modules.processes.commands.prune_processes.prune_processes import PruneProcesses
from engine.command.context import Context


class ProcessPruneListener(SaveListener[OutputEnded]):
    """Prunes old processes after an ending run has saved its output."""

    name = "processes.process-prune"

    def __init__(self, bus: Bus, rows: EventRows) -> None:
        self.bus, self.rows = bus, rows

    def handle(self, event: OutputEnded, context: Context) -> None:
        self.bus.dispatch(PruneProcesses(), context)

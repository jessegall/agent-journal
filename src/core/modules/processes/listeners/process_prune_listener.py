from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.processes.commands.prune_processes.prune_processes import PruneProcesses
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process
from core.base.change.updated import Updated
from core.base.command.context import Context


class ProcessPruneListener(SaveListener[Updated[Output]]):
    """Prunes old processes after an ending run has saved its output."""

    name = "processes.process-prune"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: Updated[Output], context: Context) -> None:
        old, output = event.old_row, event.row
        if not isinstance(old, Output) or not isinstance(output, Output):
            return
        if old.ended_at is not None or output.ended_at is None:
            return
        process = self.queries.query(Process).find(output.process_id)
        self.bus.dispatch(PruneProcesses(process.environment_id), context)

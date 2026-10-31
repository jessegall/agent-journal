from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.processes.commands.prune_outputs import PruneOutputs
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process


class OutputPruneListener(SaveListener):
    """A new kept output prunes the oldest ones past the number the settings keep, in the same transaction."""

    name = "processes.output-prune"
    event = "output.create"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, change: Change[Model]) -> None:
        output = change.row
        if isinstance(output, Output):
            self.bus.dispatch(PruneOutputs(self.queries.query(Process).find(output.process_id).environment_id), change.context)

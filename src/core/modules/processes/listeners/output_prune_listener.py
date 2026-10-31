from core.base.change.change import Change
from core.base.command.bus import Bus
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.modules.processes.commands.prune_outputs import PruneOutputs
from core.modules.processes.models.output import Output
from core.modules.processes.models.process import Process


class OutputPruneListener(SaveListener):
    """An output that ends prunes the oldest ended ones past the number the settings keep, in the same
    transaction."""

    name = "processes.output-prune"
    event = "output.update"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, change: Change[Model]) -> None:
        old, output = change.old_row, change.row
        has_ended = isinstance(output, Output) and isinstance(old, Output) and old.ended_at is None and output.ended_at is not None
        if has_ended and isinstance(output, Output):
            self.bus.dispatch(PruneOutputs(self.queries.query(Process).find(output.process_id).environment_id), change.context)

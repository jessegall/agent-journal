from journal.events.models.deleted import Deleted
from journal.features.sequences.listeners.run_termination import RunTermination
from journal.models.scoped import Scoped


class DeletedRowRunEnd(RunTermination):
    """A deleted row a run is about ends those runs, and each agent is told, so no last step waits on a row that is gone."""

    def handle(self, event: Deleted) -> None:
        row = event.model
        if not isinstance(row, Scoped):
            return
        ref = f"{row.table()}:{row.id}"
        self.told(row.environment_id, lambda run: run.about == ref, f"{ref} was deleted")

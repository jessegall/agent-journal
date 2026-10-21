from journal.events.models.deleted import Deleted
from journal.features.sequences.listeners.run_termination import RunTermination
from journal.models.sequence import Sequence


class DeletedSequenceRunEnd(RunTermination):
    """A deleted sequence ends its runs, and each agent is told, so no step waits on a sequence that is gone."""

    def handle(self, event: Deleted) -> None:
        sequence = event.model
        if not isinstance(sequence, Sequence):
            return
        for environment_id in self.running.environments_running(sequence.id):
            self.notice(environment_id, lambda run: run.sequence_id == sequence.id, f"sequence {sequence.id} was deleted")

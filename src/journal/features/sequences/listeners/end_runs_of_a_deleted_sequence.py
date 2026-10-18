from journal.events.models.deleted import Deleted
from journal.features.sequences.listeners.ending_runs import EndingRuns
from journal.models.sequence import Sequence


class EndRunsOfADeletedSequence(EndingRuns):
    """A deleted sequence ends its runs, and each agent is told, so no step waits on a sequence that is gone."""

    def handle(self, event: Deleted) -> None:
        sequence = event.model
        if not isinstance(sequence, Sequence):
            return
        for environment_id in self.running.environments_running(sequence.id):
            self.told(environment_id, lambda run: run.sequence_id == sequence.id, f"sequence {sequence.id} was deleted")

from journal.events.models.created import Created
from journal.events.listener import Listener
from journal.features.sequences.support.run_tracker import RunTracker
from journal.support.actor_kind import ActorKind
from journal.models.scoped import Scoped
from journal.repositories.sequences import Sequences
from journal.supervisor_link import SupervisorLink


class CreationStart(Listener[Created]):
    """A row an agent creates starts the sequence that names that moment, such as Building a plan on plan.created: the run is kept on that agent, about that row; the first step is typed to the agent, and a worker, which cannot be typed to, is told it at its next stop."""

    def __init__(self, sequences: Sequences, active: RunTracker, supervisor: SupervisorLink) -> None:
        self.sequences, self.running, self.supervisor = sequences, active, supervisor

    def handle(self, event: Created) -> None:
        row = event.model
        if event.actor.kind != ActorKind.AGENT or not isinstance(row, Scoped):
            return
        moment = f"{type(row).__name__.lower()}.created"
        for sequence in self.sequences.triggered_sequences(moment):
            line = self.running.start(sequence, event.actor.id, row.environment_id, topic=f"{row.table()}:{row.id}")
            if line and self.running.typed_agent(event.actor.id, row.environment_id):
                self.supervisor.type(row.environment_id, line)
            return

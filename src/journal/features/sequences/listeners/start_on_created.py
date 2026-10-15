from journal.events.models.created import Created
from journal.features.listener import Listener
from journal.features.sequences.running import Running
from journal.models.actor_kind import ActorKind
from journal.models.scoped import Scoped
from journal.repositories.sequences import Sequences
from journal.supervisor_link import SupervisorLink


class StartOnCreated(Listener[Created]):
    """A row an agent creates starts the sequence that names that moment, such as Building a plan on plan.created: the agent is moved to its first step and told it."""

    def __init__(self, sequences: Sequences, running: Running, supervisor: SupervisorLink) -> None:
        self.sequences, self.running, self.supervisor = sequences, running, supervisor

    def handle(self, event: Created) -> None:
        row = event.model
        if event.by.kind != ActorKind.AGENT or not isinstance(row, Scoped):
            return
        moment = f"{type(row).__name__.lower()}.created"
        for sequence in self.sequences.all():
            if sequence.starts_on == moment and not self.running.runs_one(event.by.id, row.environment_id):
                self.supervisor.type(row.environment_id, self.running.start(sequence, event.by.id, row.environment_id))
                return

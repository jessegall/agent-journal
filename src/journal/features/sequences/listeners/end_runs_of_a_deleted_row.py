from journal.events.models.deleted import Deleted
from journal.features.listener import Listener
from journal.features.sequences.running import Running
from journal.models.scoped import Scoped
from journal.models.sequence import Sequence
from journal.supervisor_link import SupervisorLink


class EndRunsOfADeletedRow(Listener[Deleted]):
    """A deleted sequence, or a deleted row a run is about, ends those runs, and each agent is told, so no last step waits on a row that is gone."""

    def __init__(self, running: Running, supervisor: SupervisorLink) -> None:
        self.running, self.supervisor = running, supervisor

    def handle(self, event: Deleted) -> None:
        row = event.model
        if isinstance(row, Sequence):
            for environment_id in self.running.environments_running(row.id):
                self.told(environment_id, lambda run: run.sequence_id == row.id, f"sequence {row.id} was deleted")
        elif isinstance(row, Scoped):
            ref = f"{row.table()}:{row.id}"
            self.told(row.environment_id, lambda run: run.about == ref, f"{ref} was deleted")

    def told(self, environment_id: int, gone, why: str) -> None:
        for agent, line in self.running.end_where(environment_id, gone, why):
            if self.running.typed_to(agent.session, environment_id):
                self.supervisor.type(environment_id, line)

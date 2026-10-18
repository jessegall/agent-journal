from journal.events.models.deleted import Deleted
from journal.features.listener import Listener
from journal.features.sequences.running import Running
from journal.supervisor_link import SupervisorLink


class EndingRuns(Listener[Deleted]):
    """What a listener that ends runs at a deletion shares: the runs it names are ended, and each agent is told."""

    def __init__(self, running: Running, supervisor: SupervisorLink) -> None:
        self.running, self.supervisor = running, supervisor

    def told(self, environment_id: int, gone, why: str) -> None:
        for agent, line in self.running.end_where(environment_id, gone, why):
            if self.running.typed_to(agent.session, environment_id):
                self.supervisor.type(environment_id, line)

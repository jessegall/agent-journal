from journal.events.models.deleted import Deleted
from journal.events.listener import Listener
from journal.support.run_tracker import RunTracker
from journal.supervisor_link import SupervisorLink


class RunTermination(Listener[Deleted]):
    """What a listener that ends runs at a deletion shares: the runs it names are ended, and each agent is told."""

    def __init__(self, running: RunTracker, supervisor: SupervisorLink) -> None:
        self.running, self.supervisor = running, supervisor

    def told(self, environment_id: int, gone, why: str) -> None:
        for agent, line in self.running.finish_matching(environment_id, gone, why):
            if self.running.typed_to(agent.session, environment_id):
                self.supervisor.type(environment_id, line)

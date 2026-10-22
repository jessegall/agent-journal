from journal.events.models.deleted import Deleted
from journal.events.listener import Listener
from journal.features.sequences.support.run_tracker import RunTracker
from journal.supervisor_link import SupervisorLink


class RunTermination(Listener[Deleted]):
    """What a listener that ends runs at a deletion shares: the runs it names are ended, and each agent is told."""

    def __init__(self, active: RunTracker, supervisor: SupervisorLink) -> None:
        self.running, self.supervisor = active, supervisor

    def notice(self, environment_id: int, missing, reason: str) -> None:
        for agent, line in self.running.finish_matching(environment_id, missing, reason):
            if self.running.typed_agent(agent.session, environment_id):
                self.supervisor.type(environment_id, line)

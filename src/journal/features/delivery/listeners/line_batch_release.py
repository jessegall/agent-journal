from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.supervisor_link import SupervisorLink


class LineBatchRelease(AgentListener[Ticked]):
    """The lines held for the batch window go in as one once it is up, on the clock, since nothing else may happen meanwhile."""

    def __init__(self, supervisor: SupervisorLink) -> None:
        self.supervisor = supervisor

    def handle(self, event: Ticked) -> None:
        self.supervisor.release(event.environment_id)

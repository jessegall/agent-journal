from journal.events.agent.stop import Stop
from journal.events.agent_listener import AgentListener
from journal.support.pending_restarts import PendingRestarts
from journal.supervisor_link import SupervisorLink


class PendingRestart(AgentListener[Stop]):
    """An agent owed a restart gets it the moment it stops its turn, on its own conversation."""

    def __init__(self, pending: PendingRestarts, supervisor: SupervisorLink) -> None:
        self.pending, self.supervisor = pending, supervisor

    def handle(self, event: Stop) -> None:
        obligations = self.pending.claim(event.session)
        if obligations:
            self.supervisor.restart_agent(obligations[0], obligations[1])

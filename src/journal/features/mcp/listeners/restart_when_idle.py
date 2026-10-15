from journal.events.agent.idle import Idle
from journal.features.agent_listener import AgentListener
from journal.features.mcp.pending_restarts import PendingRestarts
from journal.supervisor_link import SupervisorLink


class RestartWhenIdle(AgentListener[Idle]):
    """An agent owed a restart gets it the moment it stops its turn, on its own conversation."""

    def __init__(self, pending: PendingRestarts, supervisor: SupervisorLink) -> None:
        self.pending, self.supervisor = pending, supervisor

    def handle(self, event: Idle) -> None:
        owed = self.pending.take(event.session)
        if owed:
            self.supervisor.restart_agent(owed[0], owed[1])

from core.base.actor import Actor
from core.base.agent_role import AgentRole
from core.base.change.logged_event import LoggedEvent
from core.base.command.bus import Bus
from core.base.listener.commit_listener import CommitListener
from core.base.query.queries import Queries
from core.modules.agents.commands.end_agent.end_agent import EndAgent
from core.modules.agents.models.agent import Agent
from core.modules.drivers.events.stop_allowed import StopAllowed


class SubagentStopListener(CommitListener[StopAllowed]):
    """A subagent sends no session end, so the stop the journal lets through ends its agent row."""

    name = "drivers.subagent-stop"

    def __init__(self, bus: Bus, queries: Queries) -> None:
        self.bus, self.queries = bus, queries

    def handle(self, event: StopAllowed, logged: LoggedEvent) -> None:
        call = event.row
        agent = self.queries.query(Agent).find(call.agent_id)
        if agent.role == AgentRole.SUBAGENT and agent.ended_at is None:
            self.bus.run(EndAgent(agent.id), Actor.core(), cause_id=logged.id, environment_id=logged.environment_id)

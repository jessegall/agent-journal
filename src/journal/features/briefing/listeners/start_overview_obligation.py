from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.agents import Agents


class StartOverviewObligation(AgentListener[SessionStarted]):
    """Every start of a session owes a look at what is in flight here before any other write: the fact on the agent's row; the briefing conduct says so."""

    blocking = True

    def __init__(self, agents: Agents) -> None:
        self.agents = agents

    def handle(self, event: SessionStarted) -> None:
        self.agents.touch(self.agents.for_session(event.session), Actor.system(), oriented=False)

from journal.engine.support.session_agents import SessionAgents
from journal.events.agent.compacting import Compacting
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.agents import Agents


class CompactionReset(AgentListener[Compacting]):
    """A compacted window has not read the skills it read; they are owed again."""

    blocking = True

    def __init__(self, sessions: SessionAgents, agents: Agents) -> None:
        self.sessions, self.agents = sessions, agents

    def handle(self, event: Compacting) -> None:
        agent = self.sessions.agent(event.session, event.environment_id)
        self.agents.save(agent.with_(skills_loaded={}), Actor.system())

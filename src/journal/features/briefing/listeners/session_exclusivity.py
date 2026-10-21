from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.repositories.agents import Agents
from journal.support.actor import Actor
from journal.support.decision import Decision


class SessionExclusivity(AgentListener[SessionStarted]):
    """One main agent session per provider in an environment: the session that starts takes the place, and every other session of its provider there is retired once the briefing has named the takeover."""

    blocking = True

    def __init__(self, agents: Agents) -> None:
        self.agents = agents

    def handle(self, event: SessionStarted) -> Decision | None:
        if event.subagent:
            return None
        for counterpart in self.agents.running_peers(self.agents.session_agent(event.session)):
            self.agents.save(counterpart.retired(event.time), Actor.system())
        return None

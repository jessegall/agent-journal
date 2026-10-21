from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.repositories.agents import Agents
from journal.support.actor import Actor
from journal.supervisor_link import SupervisorLink

SILENCE_SECONDS = 3600.0


class EndSilentSessions(AgentListener[Ticked]):
    """A session silent for an hour is retired, so a closed terminal is not the current agent; the current agent a supervisor runs is left as it is."""

    def __init__(self, agents: Agents, supervisor: SupervisorLink) -> None:
        self.agents, self.supervisor = agents, supervisor

    def handle(self, event: Ticked) -> None:
        if event.silence_seconds < SILENCE_SECONDS or self.is_supervised(event):
            return
        self.agents.save(self.agents.session_agent(event.session).retired(event.time), Actor.system())

    def is_supervised(self, event: Ticked) -> bool:
        agent = self.agents.current()
        return agent is not None and agent.session == event.session and self.supervisor.runs(event.environment_id)

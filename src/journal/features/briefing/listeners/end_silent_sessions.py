from journal.engine.state_machine import StateMachine
from journal.engine.states.ended import Ended
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink

SILENCE_SECONDS = 3600.0


class EndSilentSessions(AgentListener[Ticked]):
    """A session that has sent nothing for an hour is ended, so a closed terminal does not stay the current agent for good; the current agent a supervisor still runs is only idle, and stays current."""

    def __init__(self, machine: StateMachine, agents: Agents, supervisor: SupervisorLink) -> None:
        self.machine, self.agents, self.supervisor = machine, agents, supervisor

    def handle(self, event: Ticked) -> None:
        if event.silence_seconds < SILENCE_SECONDS or self.is_supervised(event):
            return
        self.machine.move(event.session, event.environment_id, Ended())

    def is_supervised(self, event: Ticked) -> bool:
        agent = self.agents.current()
        return agent is not None and agent.session == event.session and self.supervisor.runs(event.environment_id)

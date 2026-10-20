from journal.engine.state_machine import StateMachine
from journal.engine.states.ended import Ended
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.repositories.agents import Agents
from journal.supervisor_link import SupervisorLink

QUIET_FOR = 3600.0
"""Seconds without a hook before a session is taken for gone: an agent closed without its end hook never says so itself."""


class EndSilentSessions(AgentListener[Ticked]):
    """A session that has sent nothing for an hour is ended, so a closed terminal does not stay the live agent for good; the live agent a supervisor still runs is only idle, and stays live."""

    def __init__(self, machine: StateMachine, agents: Agents, supervisor: SupervisorLink) -> None:
        self.machine, self.agents, self.supervisor = machine, agents, supervisor

    def handle(self, event: Ticked) -> None:
        if event.quiet_for < QUIET_FOR or self.is_supervised(event):
            return
        self.machine.move(event.session, event.environment_id, Ended())

    def is_supervised(self, event: Ticked) -> bool:
        live = self.agents.live()
        return live is not None and live.session == event.session and self.supervisor.runs(event.environment_id)

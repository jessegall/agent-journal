from journal.engine.machine import Machine
from journal.engine.states.ended import Ended
from journal.events.agent.ticked import Ticked
from journal.features.agent_listener import AgentListener

QUIET_FOR = 3600.0
"""Seconds without a hook before a session is taken for gone: an agent closed without its end hook never says so itself."""


class EndSilentSessions(AgentListener[Ticked]):
    """A session that has sent nothing for an hour is ended, so a closed terminal does not stay the live agent for good."""

    def __init__(self, machine: Machine) -> None:
        self.machine = machine

    def handle(self, event: Ticked) -> None:
        if event.quiet_for >= QUIET_FOR:
            self.machine.move(event.session, event.environment_id, Ended())

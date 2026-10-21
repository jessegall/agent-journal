from journal.engine.state_machine import StateMachine
from journal.engine.states.ended import Ended
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.repositories.agents import Agents
from journal.support.decision import Decision


class SessionExclusivity(AgentListener[SessionStarted]):
    """An environment has one main agent session for each provider: the session that starts takes the place, and every other of its provider there is ended, once the briefing has named a takeover, so nothing ever finds an older conversation where the agent on screen should be."""

    blocking = True

    def __init__(self, agents: Agents, machine: StateMachine) -> None:
        self.agents, self.machine = agents, machine

    def handle(self, event: SessionStarted) -> Decision | None:
        if event.subagent:
            return None
        for counterpart in self.agents.running_peers(event.session, event.environment_id, event.provider):
            self.machine.move(counterpart.session, counterpart.environment_id, Ended())
        return None

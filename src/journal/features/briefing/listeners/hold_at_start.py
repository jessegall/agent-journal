from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.session_started import SessionStarted
from journal.features.agent_listener import AgentListener
from journal.features.briefing.states.orienting import Orienting
from journal.hooks.decision import Decision


class HoldAtStart(AgentListener[SessionStarted]):
    """Every start of a session, fresh, resumed, after a compaction or taking an environment over, reads what is in flight here before any other write."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger) -> None:
        self.machine, self.nudger = machine, nudger

    def handle(self, event: SessionStarted) -> Decision | None:
        from journal.features.briefing.feature import Briefing
        agent = self.machine.agent(event.session, event.environment_id)
        current = self.machine.states.named(agent.state, agent.data)
        if not isinstance(current, Orienting):
            self.machine.move(event.session, event.environment_id, Orienting.leaving(current))
        line = self.nudger.say(agent, Briefing.ORIENT.about())
        return Decision.tell(line) if line else None

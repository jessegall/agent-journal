from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.events.agent.session_started import SessionStarted
from journal.features.agent_listener import AgentListener
from journal.features.messages.states.catching_up import CatchingUp
from journal.hooks.decision import Decision

COMPACT = "compact"


class HoldAfterCompaction(AgentListener[SessionStarted]):
    """A session that comes back from a compaction reads the latest messages before any other write."""

    blocking = True

    def __init__(self, machine: Machine, nudger: Nudger) -> None:
        self.machine, self.nudger = machine, nudger

    def handle(self, event: SessionStarted) -> Decision | None:
        from journal.features.messages.feature import Messages
        if event.source != COMPACT:
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        current = self.machine.states.named(agent.state, agent.data)
        if isinstance(current, CatchingUp):
            return None
        self.machine.move(event.session, event.environment_id, CatchingUp.leaving(current))
        line = self.nudger.say(agent, Messages.CATCH_UP.about())
        return Decision.tell(line) if line else None

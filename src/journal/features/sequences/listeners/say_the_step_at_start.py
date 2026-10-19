from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.features.registry import Registry
from journal.support.running import Running
from journal.support.decision import Decision


class SayTheStepAtStart(AgentListener[SessionStarted]):
    """A session that starts, resumes or comes back from a compaction with a run in hand is told its step, or that the run is parked and why."""

    blocking = True

    def __init__(self, running: Running, registry: Registry) -> None:
        self.running, self.registry = running, registry

    def handle(self, event: SessionStarted) -> Decision | None:
        run = self.running.in_hand(event.session, event.environment_id)
        if run is None:
            return None
        said = self.running.reminder(run)
        if self.registry.silenced(said):
            return None
        self.running.said_now(event.session, event.environment_id)
        return Decision.tell(said.rendered())

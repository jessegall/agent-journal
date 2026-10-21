from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.support.run_tracker import RunTracker


class SessionRunTransfer(AgentListener[SessionStarted]):
    """A session that starts with no sequence running takes over the runs of the last session here that ended with some."""

    blocking = True

    def __init__(self, running: RunTracker) -> None:
        self.running = running

    def handle(self, event: SessionStarted) -> None:
        self.running.transfer(event.session, event.environment_id)

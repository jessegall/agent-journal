from datetime import datetime, timezone

from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.features.updates.support.session_restart import SessionRestart


class SessionRestartClose(AgentListener[SessionStarted]):
    """A session that starts has taken up the journal's runner, so the notice asking for a new session is closed."""

    def __init__(self, restart: SessionRestart) -> None:
        self.restart = restart

    def handle(self, event: SessionStarted) -> None:
        self.restart.close(datetime.fromtimestamp(event.time, timezone.utc))

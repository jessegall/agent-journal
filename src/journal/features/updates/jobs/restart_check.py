from datetime import datetime, timezone

from journal.engine.job import Job
from journal.features.updates.support.session_restart import SessionRestart


class RestartCheck(Job):
    """Every two seconds the line the hook writes at each session start is read, and once it names the version the journal runs, the restart notice is closed in every environment, even when the start's own hook never reached the server."""

    interval_seconds = 2.0

    def __init__(self, restart: SessionRestart) -> None:
        self.restart = restart

    def tick(self, time: float) -> None:
        if self.restart.is_version_started():
            self.restart.close(datetime.fromtimestamp(time, timezone.utc))

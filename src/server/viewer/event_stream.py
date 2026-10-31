import json
import time
from collections.abc import Callable

from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.database.database import Database
from core.base.environment_names import EnvironmentNames
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from server.viewer.share_events import ShareEvents
from server.viewer.shared_row import SharedRow

POLL_SECONDS = 0.25
HEARTBEAT_SECONDS = 15.0
HEARTBEAT = ": waiting\n\n"


class EventStream:
    """Answers GET /api/events: the event log after a cursor, or after the newest event when none is given,
    kept to one environment and its environment-wide events such as registry.sync, and for a share session to
    the rows its link includes; each a server-sent message whose id is the log's and whose data names the
    event, so a stream that reconnects after its last id loses nothing; a quiet stream sends a comment now and
    then, so one the browser has closed ends."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def follow(self, environment: str, cursor_id: int | None, output: Callable[[str], bool], shared: SharedRow | None = None) -> None:
        container = synced_container(self.home)
        try:
            environment_id = container.get(EnvironmentNames).environment_id(environment)
            log, idle_seconds = container.get(EventLog), 0.0
            cursor_id = log.newest_id() if cursor_id is None else cursor_id
            while True:
                events = log.events_past(cursor_id)
                visible = events if shared is None else ShareEvents(container, shared).admitted(events)
                for event in visible:
                    if event.environment_id in (environment_id, None) and not output(self.message(event)):
                        return
                if events:
                    cursor_id, idle_seconds = events[-1].id, 0.0
                    continue
                if idle_seconds >= HEARTBEAT_SECONDS:
                    if not output(HEARTBEAT):
                        return
                    idle_seconds = 0.0
                time.sleep(POLL_SECONDS)
                idle_seconds += POLL_SECONDS
        finally:
            container.get(Database).close()

    @staticmethod
    def message(event: LoggedEvent) -> str:
        value = {"id": event.id, "event": event.event, "row_table": event.row_table, "row_id": event.row_id, "actor_id": event.actor_id}
        return f"id: {event.id}\ndata: {json.dumps(value)}\n\n"

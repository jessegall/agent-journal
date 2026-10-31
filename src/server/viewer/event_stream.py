import json
import time
from collections.abc import Callable

from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.database.database import Database
from core.base.environment_names import EnvironmentNames
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome

POLL_SECONDS = 0.25
HEARTBEAT_SECONDS = 15.0
HEARTBEAT = ": waiting\n\n"


class EventStream:
    """Answers GET /api/events: the event log after a cursor, kept to one environment, written as server-sent events
    whose ids are the log's, with the environment-wide events such as registry.sync, so a stream that reconnects after its last id loses nothing; a quiet stream sends a
    comment now and then, so one the browser has closed ends."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def follow(self, environment: str, cursor_id: int, output: Callable[[str], bool]) -> None:
        container = synced_container(self.home)
        try:
            environment_id = container.get(EnvironmentNames).environment_id(environment)
            log, quiet_seconds = container.get(EventLog), 0.0
            while True:
                events = log.events_past(cursor_id)
                for event in events:
                    if event.environment_id in (environment_id, None) and not output(self.message(event)):
                        return
                if events:
                    cursor_id, quiet_seconds = events[-1].id, 0.0
                    continue
                if quiet_seconds >= HEARTBEAT_SECONDS:
                    if not output(HEARTBEAT):
                        return
                    quiet_seconds = 0.0
                time.sleep(POLL_SECONDS)
                quiet_seconds += POLL_SECONDS
        finally:
            container.get(Database).close()

    @staticmethod
    def message(event: LoggedEvent) -> str:
        value = {"id": event.id, "event": event.event, "row_table": event.row_table, "row_id": event.row_id, "actor_id": event.actor_id}
        return f"id: {event.id}\nevent: {event.event}\ndata: {json.dumps(value)}\n\n"

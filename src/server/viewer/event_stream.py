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
from server.viewer.events_request import EventsRequest

POLL_SECONDS = 0.25
HEARTBEAT_SECONDS = 15.0
HEARTBEAT = ": waiting\n\n"


class EventStream:
    """Streams followed events in one environment with a resume cursor, restricted to shared rows for a share."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def follow(self, request: EventsRequest, output: Callable[[str], bool], shared: SharedRow | None = None) -> None:
        container = synced_container(self.home)
        try:
            environment_id = container.get(EnvironmentNames).environment_id(request.environment)
            log, idle_seconds = container.get(EventLog), 0.0
            cursor_id = log.newest_id() if request.cursor_id is None else request.cursor_id
            if request.patterns is not None and not output(f"event: cursor\ndata: {json.dumps({'id': cursor_id})}\n\n"):
                return
            while True:
                events = log.events_past(cursor_id)
                followed = [event for event in events if request.matches(event.event)]
                visible = followed if shared is None else ShareEvents(container, shared).admitted(followed)
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

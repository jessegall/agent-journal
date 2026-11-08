import json
import time
from collections.abc import Callable

from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.database.database import Database
from core.base.environment_names import EnvironmentNames
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.refusal import Refusal
from server.viewer.share_events import ShareEvents
from server.viewer.shared_row import SharedRow
from server.viewer.events_request import EventsRequest

POLL_SECONDS = 0.25
HEARTBEAT_SECONDS = 15.0
HEARTBEAT = ": waiting\n\n"


class EventStream:
    """Streams followed events of the environments asked for with a resume cursor, restricted to shared rows for a
    share. The tabs of one browser share a stream, so each event names its environment and a name that is
    gone leaves the others their events."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def follow(self, request: EventsRequest, output: Callable[[str], bool], shared: SharedRow | None = None) -> None:
        container = synced_container(self.home)
        try:
            names = self.known_environments(container.get(EnvironmentNames), request.environments)
            log, idle_seconds = container.get(EventLog), 0.0
            cursor_id = log.newest_id() if request.cursor_id is None else request.cursor_id
            if request.patterns is not None and not output(f"event: cursor\ndata: {json.dumps({'id': cursor_id})}\n\n"):
                return
            while True:
                events = log.events_past(cursor_id)
                followed = [event for event in events if request.matches(event.event)]
                visible = followed if shared is None else ShareEvents(container, shared).admitted(followed)
                for event in visible:
                    if (event.environment_id is None or event.environment_id in names) and not output(self.message(event, names.get(event.environment_id))):
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
    def known_environments(environment_names: EnvironmentNames, names: tuple[str, ...]) -> dict[int | None, str]:
        environment_id_names: dict[int | None, str] = {}
        for name in names:
            try:
                environment_id_names[environment_names.environment_id(name)] = name
            except Refusal:
                continue
        return environment_id_names

    @staticmethod
    def message(event: LoggedEvent, environment: str | None) -> str:
        changed_ids = {name: [number for number in pair if type(number) is int] for name, pair in event.data.items() if name.endswith("_id")}
        value: dict[str, object] = {"id": event.id, "event": event.event, "environment": environment, "row_table": event.row_table, "row_id": event.row_id, "actor_id": event.actor_id, "changed_ids": changed_ids}
        if event.row_table == "links":
            sources = []
            for position in (0, 1):
                model = event.data.get("source_model", (None, None))[position]
                number = event.data.get("source_id", (None, None))[position]
                source = {"model": model, "id": number}
                if isinstance(model, str) and type(number) is int and number > 0 and source not in sources:
                    sources.append(source)
            if sources:
                value.update(source_model=sources[-1]["model"], source_id=sources[-1]["id"], sources=sources)
            link_types = tuple(dict.fromkeys(link_type for link_type in event.data.get("link_type", ()) if isinstance(link_type, str)))
            if link_types:
                value.update(link_type=link_types[-1], link_types=link_types)
        return f"id: {event.id}\ndata: {json.dumps(value)}\n\n"

from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.container import Container
from core.base.error_log import ErrorLog
from core.base.listener.commit_listener import CommitListener
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.registry import Registry

FAILURE_LIMIT_ATTEMPTS = 3
CHAIN_LIMIT_ROUNDS = 50


class CommitListenerError(Exception):
    """Raised when a registered commit listener's path leads to a class that is not a commit listener."""


class CommitListenerRunner:
    """Runs the commit listeners on every logged event they have not handled yet, in order, so work a stopped run
    left undone is done by the next; an event that fails a listener three times is skipped for it."""

    def __init__(self, registry: Registry, log: EventLog, container: Container, errors: ErrorLog, cursors: ListenerCursorTable) -> None:
        self.registry, self.log, self.container, self.errors, self.cursors = registry, log, container, errors, cursors

    def run(self) -> None:
        entries = tuple(entry for entry in self.registry.listeners if entry.timing is ListenerTiming.COMMIT)
        for entry in entries:
            self.cursors.start(entry.name)
        for _ in range(CHAIN_LIMIT_ROUNDS):
            if not self.cursors.has_gap():
                return
            progress = [self.run_listener(entry) for entry in entries]
            if not any(progress):
                return

    def run_listener(self, entry: ListenerEntry) -> bool:
        cursor = self.cursors.position(entry.name)
        progress = False
        for event in self.log.events_past(cursor):
            if entry.event.matches(event.event) and not self.handle_event(entry, event):
                return progress
            self.cursors.move(entry.name, event.id)
            progress = True
        return progress

    def handle_event(self, entry: ListenerEntry, event: LoggedEvent) -> bool:
        listener_class = entry.path.loaded()
        if not issubclass(listener_class, CommitListener):
            raise CommitListenerError(f"{entry.path.text} is no commit listener")
        try:
            self.container.get(listener_class).handle(event)
        except Exception as error:
            failures = self.cursors.failure_count(entry.name, event.id)
            self.errors.reported(["listener", entry.name, "event", str(event.id)], error)
            return failures >= FAILURE_LIMIT_ATTEMPTS
        return True

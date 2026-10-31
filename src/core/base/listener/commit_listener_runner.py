from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.container import Container
from core.base.error_log import ErrorLog
from core.base.listener.commit_listener import CommitListener
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry

FAILURE_LIMIT_ATTEMPTS = 3
CHAIN_LIMIT_ROUNDS = 50


class CommitListenerError(Exception):
    """Raised when a registered commit listener's path leads to a class that is not a commit listener."""


class CommitListenerRunner:
    """Runs the commit listeners on every logged event they have not handled yet, in order, so work a stopped
    run left undone is done by the next. It claims each event before handling it, so a second runner never
    handles the same one; an event that fails is given back to be tried again, and one that fails three
    times is skipped."""

    def __init__(self, registry: Registry, log: EventLog, container: Container, errors: ErrorLog, cursors: ListenerCursorTable) -> None:
        self.registry, self.log, self.container, self.errors, self.cursors = registry, log, container, errors, cursors

    def run(self) -> None:
        entries = tuple(entry for entry in self.registry.listeners if entry.timing is ListenerTiming.COMMIT)
        for _ in range(CHAIN_LIMIT_ROUNDS):
            if not self.cursors.has_unhandled_events():
                return
            progress = [self.run_listener(entry) for entry in entries]
            if not any(progress):
                return

    def run_listener(self, entry: ListenerEntry) -> bool:
        position = self.cursors.position(entry.name)
        progress = False
        for event in self.log.events_past(position):
            if not self.cursors.claimed(entry.name, position, event.id):
                return progress
            if entry.event.matches(event.event) and not self.handle_event(entry, event):
                self.cursors.claimed(entry.name, event.id, position)
                return progress
            position, progress = event.id, True
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

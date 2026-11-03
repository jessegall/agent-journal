from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.container import Container
from core.base.error_log import ErrorLog
from core.base.fault_sink import FaultSink
from core.base.listener.commit_listener import CommitListener
from core.base.database.database import Database
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from core.base.listener.commit_listener_error import CommitListenerError


FAILURE_LIMIT_ATTEMPTS = 3
CHAIN_LIMIT_ROUNDS = 50
COSTLY_LISTENER_POINTS = 500


class CommitListenerRunner:
    """Runs the commit listeners on every logged event they have not handled yet, in order, so work a stopped
    run left undone is done by the next. It claims each event before handling it, so a second runner never
    handles the same one; an event that fails is given back to be tried again, and one that fails three
    times is skipped. Listeners a person waits on run again after each other listener that handled events,
    and a costly one is noted with its points."""

    def __init__(self, registry: Registry, log: EventLog, container: Container, errors: ErrorLog, cursors: ListenerCursorTable,
                 faults: FaultSink) -> None:
        self.registry, self.log, self.container, self.errors, self.cursors, self.faults = registry, log, container, errors, cursors, faults

    def run(self) -> None:
        try:
            self.faults.flush()
        except Exception as failure:
            self.errors.noted(f"waiting faults could not be recorded: {type(failure).__name__}: {failure}")
        entries = sorted((entry for entry in self.registry.listeners if entry.timing is ListenerTiming.COMMIT), key=self.run_order)
        urgent_entries = [entry for entry in entries if self.run_order(entry) < 0]
        for _ in range(CHAIN_LIMIT_ROUNDS):
            if not self.cursors.has_unhandled_events():
                return
            progress = [self.run_entry(entry, urgent_entries) for entry in entries]
            if not any(progress):
                return

    def run_entry(self, entry: ListenerEntry, urgent_entries: list[ListenerEntry]) -> bool:
        handled = self.run_listener(entry)
        if handled:
            for listener in urgent_entries:
                self.run_listener(listener)
        return handled

    @staticmethod
    def run_order(entry: ListenerEntry) -> int:
        listener_class = entry.path.loaded()
        return listener_class.run_order if issubclass(listener_class, CommitListener) else 0

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
        counter = self.container.get(Database).tally
        points_at_start = counter.points()
        try:
            self.container.get(listener_class).handle(event)
            cost = counter.points().minus(points_at_start)
            if cost.total >= COSTLY_LISTENER_POINTS:
                self.errors.noted(f"listener {entry.name} cost {cost.line()} on event {event.id} {event.event}")
        except Exception as error:
            failures = self.cursors.failure_count(entry.name, event.id)
            self.errors.reported(["listener", entry.name, "event", str(event.id)], error, event.environment_id)
            return failures >= FAILURE_LIMIT_ATTEMPTS
        return True

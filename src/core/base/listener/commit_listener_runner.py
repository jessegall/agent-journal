from functools import cached_property

from core.base.change.event_log import EventLog
from core.base.change.logged_event import LoggedEvent
from core.base.container import Container
from core.base.error_log import ErrorLog
from core.base.exception_sink import ExceptionSink
from core.base.listener.commit_listener import CommitListener
from core.base.database.listener_cursor_table import ListenerCursorTable
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.registry import Registry
from core.base.scope.scopes import Scopes
from core.base.listener.commit_listener_error import CommitListenerError
from core.base.listener.event_builder import EventBuilder
from core.base.database.performance_costs import PerformanceCosts
from core.base.performance.performance_state import PerformanceState


FAILURE_LIMIT_ATTEMPTS = 3
CHAIN_LIMIT_ROUNDS = 50
COSTLY_LISTENER_POINTS = 500


class CommitListenerRunner:
    """Runs commit listeners with at most once delivery across a server stop; reported failures are retried."""

    def __init__(self, registry: Registry, log: EventLog, container: Container, errors: ErrorLog, cursors: ListenerCursorTable,
                 exceptions: ExceptionSink, scopes: Scopes) -> None:
        self.registry, self.log, self.container, self.errors, self.cursors, self.exceptions, self.scopes = registry, log, container, errors, cursors, exceptions, scopes
        self.positions: dict[str, int] = {}

    def run(self) -> None:
        self.flush_exceptions()
        entries = self.commit_entries()
        self.run_rounds(entries, [entry for entry in entries if self.is_urgent(entry)])

    def run_urgent(self) -> None:
        urgent_entries = [entry for entry in self.commit_entries() if self.is_urgent(entry)]
        self.run_rounds(urgent_entries, [])

    def run_ordinary(self) -> None:
        self.flush_exceptions()
        self.run_rounds([entry for entry in self.commit_entries() if not self.is_urgent(entry)], [])

    def flush_exceptions(self) -> None:
        try:
            self.exceptions.flush()
        except Exception as failure:
            self.errors.noted(f"waiting exceptions could not be recorded: {type(failure).__name__}: {failure}")

    def commit_entries(self) -> list[ListenerEntry]:
        return self.sorted_entries

    @cached_property
    def sorted_entries(self) -> list[ListenerEntry]:
        return sorted((entry for entry in self.registry.listeners if entry.timing is ListenerTiming.COMMIT), key=self.run_order)

    def is_urgent(self, entry: ListenerEntry) -> bool:
        return self.run_order(entry) < 0

    def run_rounds(self, entries: list[ListenerEntry], urgent_entries: list[ListenerEntry]) -> None:
        for _ in range(CHAIN_LIMIT_ROUNDS):
            state = self.container.get(PerformanceState)
            boot_event = state.boot_event()
            if boot_event and not self.cursors.has_pending_events(boot_event):
                state.finish_start()
            if not self.cursors.has_unhandled_events():
                return
            if not self.run_round(entries, urgent_entries):
                return

    def run_round(self, entries: list[ListenerEntry], urgent_entries: list[ListenerEntry]) -> bool:
        positions = self.known_positions(entries)
        events = self.log.events_past(min(positions[entry.name] for entry in entries)) if entries else []
        if not events:
            return False
        due_entries = [entry for entry in entries if any(event.id > positions[entry.name] and entry.event.matches(event.event) for event in events)]
        due_names = {entry.name for entry in due_entries}
        moved_count = self.cursors.advance_all([entry.name for entry in entries if entry.name not in due_names], events[-1].id)
        positions.update({entry.name: events[-1].id for entry in entries if entry.name not in due_names})
        progress = [self.run_entry(entry, urgent_entries, events) for entry in due_entries]
        positions.update({entry.name: self.cursors.position(entry.name) for entry in due_entries})
        return bool(moved_count) or any(progress)

    def known_positions(self, entries: list[ListenerEntry]) -> dict[str, int]:
        if any(entry.name not in self.positions for entry in entries):
            self.positions = self.cursors.positions()
        return self.positions

    def run_entry(self, entry: ListenerEntry, urgent_entries: list[ListenerEntry], events: list[LoggedEvent]) -> bool:
        handled = self.run_listener(entry, events)
        if handled and urgent_entries:
            self.run_urgent_events(urgent_entries, events)
        return handled

    def run_urgent_events(self, urgent_entries: list[ListenerEntry], events: list[LoggedEvent]) -> None:
        if self.log.newest_id() == events[-1].id:
            return
        newer_events = self.log.events_past(events[-1].id)
        for listener in urgent_entries:
            self.run_listener(listener, newer_events)

    @staticmethod
    def run_order(entry: ListenerEntry) -> int:
        listener_class = entry.path.loaded()
        return listener_class.run_order if issubclass(listener_class, CommitListener) else 0

    def run_listener(self, entry: ListenerEntry, round_events: list[LoggedEvent]) -> bool:
        position = self.cursors.position(entry.name)
        events = [event for event in round_events if event.id > position]
        progress = False
        for event in events:
            if not entry.event.matches(event.event):
                continue
            if not self.cursors.claimed(entry.name, position, event.id):
                return progress
            if not self.handle_event(entry, event):
                self.cursors.claimed(entry.name, event.id, position)
                return progress
            position, progress = event.id, True
        if events and events[-1].id != position:
            return self.cursors.claimed(entry.name, position, events[-1].id) or progress
        return progress

    def handle_event(self, entry: ListenerEntry, event: LoggedEvent) -> bool:
        listener_class = entry.path.loaded()
        if not issubclass(listener_class, CommitListener):
            raise CommitListenerError(f"{entry.path.text} is no commit listener")
        tools = self.container.get(PerformanceCosts)
        start_points = tools.begin()
        try:
            with self.scopes.event_scope(listener_class.disabled_scopes, event):
                built_event = self.container.get(EventBuilder).built(listener_class.event_type(event.event), event)
                if built_event is not None:
                    self.container.get(listener_class).handle(built_event, event)
            cost = tools.cost(start_points)
            if cost is not None and cost.total >= COSTLY_LISTENER_POINTS:
                self.errors.noted(f"listener {entry.name} cost {cost.line()} on event {event.id} {event.event}")
        except Exception as error:
            failures = self.cursors.failure_count(entry.name, event.id)
            self.errors.reported(["listener", entry.name, "event", str(event.id)], error, event.environment_id)
            return failures >= FAILURE_LIMIT_ATTEMPTS
        return True

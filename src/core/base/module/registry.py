import json
from dataclasses import dataclass

from core.base.change.event_pattern import EventPattern
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.module.dotted_path import DottedPath
from core.base.module.guard_entry import GuardEntry
from core.base.module.listener_entry import ListenerEntry, ListenerTiming

READ = Statement("SELECT fingerprint, entries FROM registry WHERE id = 1")


class StaleRegistry(Exception):
    """Raised when the code has changed since the registry was built, so it must be synced first."""


@dataclass(frozen=True)
class Registry:
    """What sync found in every module: which module owns each noun, which handler runs each command, which
    class answers each subcommand, and every guard and listener with the events it covers."""

    fingerprint: str
    nouns: dict[str, str]
    handlers: dict[str, DottedPath]
    subcommands: dict[str, DottedPath]
    guards: tuple[GuardEntry, ...]
    listeners: tuple[ListenerEntry, ...]

    @classmethod
    def read(cls, database: Database) -> "Registry":
        rows = database.rows(READ)
        if not rows:
            raise StaleRegistry("the journal has never been synced: journal module sync")
        entries = json.loads(rows[0]["entries"])
        return cls(
            fingerprint=rows[0]["fingerprint"],
            nouns=dict(entries["nouns"]),
            handlers={command: DottedPath(path) for command, path in entries["handlers"].items()},
            subcommands={line: DottedPath(path) for line, path in entries["subcommands"].items()},
            guards=tuple(GuardEntry(guard["name"], EventPattern(guard["event"]), DottedPath(guard["path"]), guard["position"], guard["short_flag"])
                         for guard in entries["guards"]),
            listeners=tuple(ListenerEntry(listener["name"], EventPattern(listener["event"]), ListenerTiming(listener["timing"]), DottedPath(listener["path"]),
                                          listener["position"]) for listener in entries["listeners"]),
        )

    def require_current(self, code_fingerprint: str) -> None:
        if code_fingerprint != self.fingerprint:
            raise StaleRegistry("the journal's modules changed: journal module sync")

    def event_guards(self, event: str) -> tuple[GuardEntry, ...]:
        return tuple(sorted((guard for guard in self.guards if guard.event.matches(event)), key=lambda guard: guard.position))

    def event_listeners(self, event: str, timing: ListenerTiming) -> tuple[ListenerEntry, ...]:
        matching = (listener for listener in self.listeners if listener.timing is timing and listener.event.matches(event))
        return tuple(sorted(matching, key=lambda listener: listener.position))

    def has_handler(self, command: type) -> bool:
        return DottedPath.class_path(command).text in self.handlers

    def command_handler(self, command: type) -> DottedPath:
        return self.handlers[DottedPath.class_path(command).text]

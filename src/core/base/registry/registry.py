import json
from dataclasses import dataclass

from core.base.change.event_pattern import EventPattern
from core.base.database.database import Database
from core.base.database.registry_table import RegistryTable
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.noun_entry import NounEntry



class StaleRegistryError(Exception):
    """Raised when the code has changed since the registry was built, so it must be synced first."""


@dataclass(frozen=True)
class Registry:
    """What sync found in every module: which module owns each noun, which handler runs each command, which
    class answers each subcommand, and every guard and listener with the events it covers."""

    fingerprint: str
    nouns: dict[str, NounEntry]
    handlers: dict[str, DottedPath]
    subcommands: dict[str, DottedPath]
    guards: tuple[GuardEntry, ...]
    listeners: tuple[ListenerEntry, ...]

    @classmethod
    def read(cls, database: Database) -> "Registry":
        row = RegistryTable(database).row()
        if row is None:
            raise StaleRegistryError("the journal has never been synced: journal module sync")
        entries = json.loads(row["entries"])
        return cls(
            fingerprint=row["fingerprint"],
            nouns={cli_noun: NounEntry(noun["module"], DottedPath(noun["model"]), tuple(noun["commands"])) for cli_noun, noun in entries["nouns"].items()},
            handlers={command: DottedPath(path) for command, path in entries["handlers"].items()},
            subcommands={line: DottedPath(path) for line, path in entries["subcommands"].items()},
            guards=tuple(GuardEntry(guard["name"], EventPattern(guard["event"]), DottedPath(guard["path"]), guard["position"], guard["short_flag"])
                         for guard in entries["guards"]),
            listeners=tuple(ListenerEntry(listener["name"], EventPattern(listener["event"]), ListenerTiming(listener["timing"]), DottedPath(listener["path"]),
                                          listener["position"], listener["actor_id"]) for listener in entries["listeners"]),
        )

    def entries_text(self) -> str:
        return json.dumps({
            "nouns": {cli_noun: {"module": noun.module, "model": noun.model.text, "commands": list(noun.commands)} for cli_noun, noun in self.nouns.items()},
            "handlers": {command: path.text for command, path in self.handlers.items()},
            "subcommands": {line: path.text for line, path in self.subcommands.items()},
            "guards": [{"name": guard.name, "event": guard.event.text, "path": guard.path.text, "position": guard.position, "short_flag": guard.short_flag}
                       for guard in self.guards],
            "listeners": [{"name": listener.name, "event": listener.event.text, "timing": listener.timing.value, "path": listener.path.text,
                           "position": listener.position, "actor_id": listener.actor_id} for listener in self.listeners],
        }, sort_keys=True)

    def require_current(self, code_fingerprint: str) -> None:
        if code_fingerprint != self.fingerprint:
            raise StaleRegistryError("the journal's modules changed: journal module sync")

    def event_guards(self, event: str) -> tuple[GuardEntry, ...]:
        return tuple(sorted((guard for guard in self.guards if guard.event.matches(event)), key=lambda guard: guard.position))

    def event_listeners(self, event: str, timing: ListenerTiming) -> tuple[ListenerEntry, ...]:
        matching = (listener for listener in self.listeners if listener.timing is timing and listener.event.matches(event))
        return tuple(sorted(matching, key=lambda listener: listener.position))

    def has_handler(self, command: type) -> bool:
        return DottedPath.class_path(command).text in self.handlers

    def command_handler(self, command: type) -> DottedPath:
        return self.handlers[DottedPath.class_path(command).text]

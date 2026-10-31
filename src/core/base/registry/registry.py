import json
from dataclasses import dataclass, field, replace

from core.base.change.event_pattern import EventPattern
from core.base.database.database import Database
from core.base.container import Container
from core.base.database.registry_table import RegistryTable
from core.base.registry.dotted_path import DottedPath
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry, ListenerTiming
from core.base.registry.model_entry import ModelEntry
from core.base.registry.overlay_entry import OverlayEntry



class StaleRegistryError(Exception):
    """Raised when the code has changed since the registry was built, so it must be synced first."""


@dataclass(frozen=True)
class Registry:
    """What sync found in every module: which module owns each entry, which handler runs each command, which
    class answers each subcommand, and every guard and listener with the events it covers."""

    fingerprint: str
    models: dict[str, ModelEntry]
    handlers: dict[str, DottedPath]
    subcommands: dict[str, DottedPath]
    guards: tuple[GuardEntry, ...]
    listeners: tuple[ListenerEntry, ...]
    bindings: dict[str, DottedPath] = field(default_factory=lambda: {})
    overlays: tuple[OverlayEntry, ...] = ()

    @classmethod
    def read(cls, database: Database) -> "Registry":
        row = RegistryTable(database).row()
        if row is None:
            raise StaleRegistryError("the journal has never been synced: journal module sync")
        entries = json.loads(row["entries"])
        return cls(
            fingerprint=row["fingerprint"],
            models={cli_name: ModelEntry(entry["module"], DottedPath(entry["model"]), tuple(entry["commands"]), tuple(entry["excluded_subcommands"])) for cli_name, entry in entries["models"].items()},
            handlers={command: DottedPath(path) for command, path in entries["handlers"].items()},
            subcommands={line: DottedPath(path) for line, path in entries["subcommands"].items()},
            guards=tuple(GuardEntry(guard["name"], EventPattern(guard["event"]), DottedPath(guard["path"]), guard["position"], guard["short_flag"])
                         for guard in entries["guards"]),
            listeners=tuple(ListenerEntry(listener["name"], EventPattern(listener["event"]), ListenerTiming(listener["timing"]), DottedPath(listener["path"]),
                                          listener["position"], listener["actor_id"]) for listener in entries["listeners"]),
            bindings={interface: DottedPath(path) for interface, path in entries["bindings"].items()},
            overlays=tuple(OverlayEntry(overlay["name"], DottedPath(overlay["path"]), overlay["position"], tuple(overlay["drivers"])) for overlay in entries.get("overlays", [])),
        )

    def entries_text(self) -> str:
        return json.dumps({
            "models": {cli_name: {"module": entry.module, "model": entry.model.text, "commands": list(entry.commands), "excluded_subcommands": list(entry.excluded_subcommands)} for cli_name, entry in self.models.items()},
            "handlers": {command: path.text for command, path in self.handlers.items()},
            "subcommands": {line: path.text for line, path in self.subcommands.items()},
            "guards": [{"name": guard.name, "event": guard.event.text, "path": guard.path.text, "position": guard.position, "short_flag": guard.short_flag}
                       for guard in self.guards],
            "listeners": [{"name": listener.name, "event": listener.event.text, "timing": listener.timing.value, "path": listener.path.text,
                           "position": listener.position, "actor_id": listener.actor_id} for listener in self.listeners],
            "bindings": {interface: path.text for interface, path in self.bindings.items()},
            "overlays": [{"name": overlay.name, "path": overlay.path.text, "position": overlay.position, "drivers": list(overlay.drivers)} for overlay in self.overlays],
        }, sort_keys=True)

    def with_overlays(self, overlays: tuple[OverlayEntry, ...]) -> "Registry":
        return replace(self, overlays=overlays)

    def driver_overlays(self, driver: str) -> list[OverlayEntry]:
        return [overlay for overlay in self.overlays if overlay.covers(driver)]

    def bind(self, container: Container) -> None:
        for interface, implementation in self.bindings.items():
            container.substitute(DottedPath(interface).loaded(), implementation.loaded())

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

import json
from dataclasses import asdict, dataclass, field, replace

from core.base.change.event_pattern import EventPattern
from core.base.database.database import Database
from core.base.container import Container
from core.base.database.registry_table import RegistryTable
from core.base.registry.dotted_path import DottedPath
from core.base.registry.driver_entry import DriverEntry
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.button_line import ButtonLine
from core.base.registry.button_window import ButtonWindow
from core.base.registry.dock_entry import DockEntry
from core.base.registry.mark_entry import MarkEntry
from core.base.registry.model_entry import ModelEntry
from core.base.registry.overlay_entry import OverlayEntry
from core.base.registry.provider_entry import ProviderEntry
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.registry.suite_entry import SuiteEntry
from core.base.registry.window_entry import WindowEntry
from core.base.viewer.layout_preset import LayoutPreset
from core.base.viewer.window_declaration import DEFAULT_FLOAT_SIZE
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.layout_shape import loaded_layout, stored_layout


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
    rules: tuple[DriverRuleEntry, ...] = ()
    suites: tuple[SuiteEntry, ...] = ()
    drivers: tuple[DriverEntry, ...] = ()
    windows: tuple[WindowEntry, ...] = ()
    marks: tuple[MarkEntry, ...] = ()
    docks: tuple[DockEntry, ...] = ()
    providers: tuple[ProviderEntry, ...] = ()
    module_fingerprints: dict[str, str] = field(default_factory=lambda: {})

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
            rules=tuple(DriverRuleEntry(rule["name"], DottedPath(rule["path"]), rule["hook"], rule["position"], rule["owner"], tuple(rule["drivers"]), tuple(rule["roles"]),
                                        rule["permanent"], rule["essential"], rule.get("history", False), rule.get("claims_essential", False))
                        for rule in entries.get("rules", [])),
            suites=tuple(SuiteEntry(suite["name"], suite["module"], tuple(suite["requires"]), suite["defaults"], suite["complete_control"], tuple(suite["included_overlays"]),
                                    tuple(suite.get("windows", [])), {page: loaded_layout(shape) for page, shape in suite.get("layouts", {}).items()},
                                    {page: tuple(LayoutPreset(preset["key"], preset["name"], preset["text"], loaded_layout(preset["shape"])) for preset in presets)
                                     for page, presets in suite.get("presets", {}).items()})
                         for suite in entries.get("suites", [])),
            drivers=tuple(DriverEntry(driver["name"], DottedPath(driver["path"]), driver["module"], driver["suite"], driver["role"], tuple(driver["opening_lines"]),
                                      tuple(driver.get("guards", [])))
                          for driver in entries.get("drivers", [])),
            windows=tuple(WindowEntry(window["name"], window["module"], window["title"], window["entry"], window["loading"], window["place"], tuple(window["roles"]),
                                      tuple(window["reads"]), tuple(window["runs"]), tuple(window["events"]), window["shipped"], window["unavailable_reason"],
                                      window.get("icon", WindowIcon.WINDOW.value), window.get("float_width", DEFAULT_FLOAT_SIZE.width),
                                      window.get("float_height", DEFAULT_FLOAT_SIZE.height), tuple(window.get("options", [])), window.get("count", ""))
                          for window in entries.get("windows", [])),
            marks=tuple(MarkEntry.restored(mark) for mark in entries.get("marks", [])),
            docks=tuple(DockEntry.restored(dock) for dock in entries.get("docks", [])),
            providers=tuple(ProviderEntry(provider["name"], DottedPath(provider["path"]), provider["module"], provider["title"]) for provider in entries.get("providers", [])),
            module_fingerprints=dict(entries.get("module_fingerprints", {})),
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
            "rules": [{"name": rule.name, "path": rule.path.text, "hook": rule.hook, "position": rule.position, "owner": rule.owner, "drivers": list(rule.drivers),
                       "roles": list(rule.roles), "permanent": rule.permanent, "essential": rule.essential, "history": rule.history,
                       "claims_essential": rule.claims_essential} for rule in self.rules],
            "suites": [{"name": suite.name, "module": suite.module, "requires": list(suite.requires), "defaults": dict(suite.defaults), "complete_control": suite.complete_control,
                        "included_overlays": list(suite.included_overlays), "windows": list(suite.windows),
                        "layouts": {page: stored_layout(shape) for page, shape in suite.layouts.items()},
                        "presets": {page: [{"key": preset.key, "name": preset.name, "text": preset.text, "shape": stored_layout(preset.shape)} for preset in presets]
                                    for page, presets in suite.presets.items()}} for suite in self.suites],
            "drivers": [{"name": driver.name, "path": driver.path.text, "module": driver.module, "suite": driver.suite, "role": driver.role,
                         "opening_lines": list(driver.opening_lines), "guards": list(driver.guards)} for driver in self.drivers],
            "windows": [{"name": window.name, "module": window.module, "title": window.title, "entry": window.entry, "loading": window.loading,
                         "place": window.place, "roles": list(window.roles), "reads": list(window.reads), "runs": list(window.runs), "events": list(window.events),
                         "shipped": window.shipped, "unavailable_reason": window.unavailable_reason, "icon": window.icon,
                         "float_width": window.float_width, "float_height": window.float_height, "options": [dict(option) for option in window.options], "count": window.count} for window in self.windows],
            "marks": [asdict(mark) for mark in self.marks],
            "docks": [asdict(dock) for dock in self.docks],
            "providers": [{"name": provider.name, "path": provider.path.text, "module": provider.module, "title": provider.title} for provider in self.providers],
            "module_fingerprints": self.module_fingerprints,
        }, sort_keys=True)

    def with_overlays(self, overlays: tuple[OverlayEntry, ...]) -> "Registry":
        return replace(self, overlays=overlays)

    def with_rules(self, rules: tuple[DriverRuleEntry, ...]) -> "Registry":
        return replace(self, rules=rules)

    def essential_rules(self, driver: str, hook_name: str) -> list[DriverRuleEntry]:
        return [rule for rule in self.hook_rules(hook_name) if rule.is_driver_standing_rule(driver)]

    def overlay_rules(self, overlay: str, hook_name: str) -> list[DriverRuleEntry]:
        return [rule for rule in self.hook_rules(hook_name) if rule.owner == overlay and not rule.drivers]

    def driver_rules(self, driver: str, role: str, hook_name: str) -> list[DriverRuleEntry]:
        return [rule for rule in self.hook_rules(hook_name) if not rule.essential and not rule.permanent and rule.covers_driver(driver, role)]

    def hook_rules(self, hook_name: str) -> list[DriverRuleEntry]:
        return sorted((rule for rule in self.rules if rule.covers_hook(hook_name)), key=lambda rule: rule.position)

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

    def suite(self, name: str) -> SuiteEntry | None:
        return next((suite for suite in self.suites if suite.name == name), None)

    def button_lines(self, window: str) -> tuple[ButtonLine, ...]:
        if window == ButtonWindow.MARKS:
            return tuple(ButtonLine(mark.module, button["runs"]) for mark in self.marks for button in (*mark.buttons, *mark.group_buttons))
        if window == ButtonWindow.DOCK:
            return tuple(ButtonLine(dock.module, button["runs"]) for dock in self.docks for button in dock.buttons)
        return ()

    def has_window(self, name: str) -> bool:
        return any(window.name == name for window in self.windows)

    def window(self, name: str) -> WindowEntry:
        return next(window for window in self.windows if window.name == name)

    def driver(self, name: str) -> DriverEntry | None:
        return next((driver for driver in self.drivers if driver.name == name), None)

    def top_suites(self) -> list[SuiteEntry]:
        required = {name for suite in self.suites for name in suite.requires}
        return [suite for suite in self.suites if suite.name not in required]

    def suite_drivers(self, suite: SuiteEntry) -> list[DriverEntry]:
        return [driver for driver in self.drivers if driver.suite in (suite.name, *suite.requires)]


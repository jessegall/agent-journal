import json
import sqlite3
from collections.abc import Sequence
from core.base.registry.profile_entry import ProfileEntry
from engine.errors.refusal import Refusal
from core.base.agent_policy import AgentPolicy
from engine.enums.role_group import RoleGroup
from core.base.agent_group_book import AgentGroupBook
from core.base.helper_type_book import HelperTypeBook
from core.base.registry.agent_group_entry import AgentGroupEntry
from core.base.registry.helper_type_entry import HelperTypeEntry
from dataclasses import asdict, dataclass, field, replace
from functools import cached_property, lru_cache
from core.base.registry.parsed_registries import ParsedRegistries

from core.base.change.event_pattern import EventPattern
from core.base.database.database import Database
from core.base.container import Container
from core.base.database.registry_table import RegistryTable
from core.base.database.registry_version import RegistryVersion
from core.base.dotted_path.dotted_path import DottedPath
from core.base.registry.driver_entry import DriverEntry
from core.base.registry.driver_rule_entry import DriverRuleEntry
from core.base.registry.event_key_entry import EventKeyEntry
from core.base.registry.event_lookup import EventLookup
from core.base.registry.guard_entry import GuardEntry
from core.base.registry.listener_entry import ListenerEntry
from core.base.registry.listener_timing import ListenerTiming
from core.base.registry.button_line import ButtonLine
from core.base.registry.button_window import ButtonWindow
from core.base.registry.dock_entry import DockEntry
from core.base.registry.template_entry import TemplateEntry
from core.base.registry.button_entry import ButtonEntry
from core.base.registry.inspector_entry import InspectorEntry
from core.base.registry.mark_entry import MarkEntry
from core.base.registry.nudge_entry import NudgeEntry
from core.base.registry.setting_entry import SettingEntry
from core.base.registry.tunnel_entry import TunnelEntry
from core.base.registry.model_entry import ModelEntry
from core.base.registry.move_entry import MoveEntry
from core.base.registry.overlay_entry import OverlayEntry
from core.base.registry.provider_entry import ProviderEntry
from core.base.registry.skill_entry import SkillEntry
from core.base.model.state_book import StateBook
from core.base.registry.stale_registry_error import StaleRegistryError
from core.base.registry.state_addition_entry import StateAdditionEntry
from core.base.registry.suite_entry import SuiteEntry
from core.base.registry.window_entry import WindowEntry
from core.base.viewer.layout_preset import LayoutPreset
from core.base.viewer.window_declaration import DEFAULT_FLOAT_SIZE
from core.base.viewer.window_icon import WindowIcon
from core.base.viewer.layout_shape import loaded_layout, stored_layout


# a registry saved before windows were split into where they are drawn and whose work they show: an environment or agent window was drawn in a pane
LEGACY_PLACES = {"environment": "pane", "agent": "pane"}
LEGACY_SHOWS = {"agent": "one-agent"}
KEPT_REGISTRIES = 32
PARSED_REGISTRIES = ParsedRegistries(KEPT_REGISTRIES)
BUILT_READS = ("make", "show", "list")


@dataclass(frozen=True)
class Registry:
    """The module entries found by sync, kept by database, fingerprint and sync timestamp. Journals whose
    registry rows hold the same fingerprint and entries share one registry, so its event lookup, built in
    full when it loads, is built once per process however many journals open."""

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
    nudges: tuple[NudgeEntry, ...] = ()
    docks: tuple[DockEntry, ...] = ()
    templates: tuple[TemplateEntry, ...] = ()
    buttons: tuple[ButtonEntry, ...] = ()
    button_slots: tuple[str, ...] = ()
    inspectors: tuple[InspectorEntry, ...] = ()
    inspector_slots: tuple[str, ...] = ()
    state_additions: tuple[StateAdditionEntry, ...] = ()
    helper_types: tuple[HelperTypeEntry, ...] = ()
    agent_groups: tuple[AgentGroupEntry, ...] = ()
    profiles: tuple[ProfileEntry, ...] = ()
    providers: tuple[ProviderEntry, ...] = ()
    settings: tuple[SettingEntry, ...] = ()
    tunnels: tuple[TunnelEntry, ...] = ()
    shared_rows: dict[str, DottedPath] = field(default_factory=dict[str, DottedPath])
    library_shares: dict[str, DottedPath] = field(default_factory=dict[str, DottedPath])
    skills: tuple[SkillEntry, ...] = ()
    moves: tuple[MoveEntry, ...] = ()
    module_fingerprints: dict[str, str] = field(default_factory=lambda: {})
    module_suites: dict[str, tuple[str, ...]] = field(default_factory=dict[str, tuple[str, ...]])
    events: tuple[str, ...] = ()
    outward_lines: tuple[str, ...] = ()
    background_lines: tuple[str, ...] = ()
    event_keys: dict[str, EventKeyEntry] = field(default_factory=dict[str, EventKeyEntry])
    former_event_keys: dict[str, str] = field(default_factory=dict[str, str])
    declared_plugin_events: tuple[str, ...] = ()

    @classmethod
    def read(cls, database: Database) -> "Registry":
        try:
            version = RegistryTable(database).version()
        except sqlite3.OperationalError as error:
            if str(error) != "no such table: registry":
                raise
            raise StaleRegistryError("the journal has never been synced: journal module sync") from error
        if version is None:
            raise StaleRegistryError("the journal has never been synced: journal module sync")
        return cls.loaded(version)

    @classmethod
    @lru_cache(maxsize=KEPT_REGISTRIES)
    def loaded(cls, version: RegistryVersion) -> "Registry":
        row = RegistryTable(version.database).row()
        if row is None:
            raise StaleRegistryError("the journal has never been synced: journal module sync")
        return cls.parsed(row["fingerprint"], row["entries"])

    @classmethod
    def parsed(cls, fingerprint: str, entries_text: str) -> "Registry":
        return PARSED_REGISTRIES.kept((fingerprint, entries_text), lambda: cls.built(fingerprint, entries_text))

    @classmethod
    def built(cls, fingerprint: str, entries_text: str) -> "Registry":
        entries = json.loads(entries_text)
        return cls(
            fingerprint=fingerprint,
            models={cli_name: ModelEntry(entry["module"], DottedPath(entry["model"]), tuple(entry["commands"]), tuple(entry["excluded_subcommands"])) for cli_name, entry in entries["models"].items()},
            handlers={command: DottedPath(path) for command, path in entries["handlers"].items()},
            subcommands={line: DottedPath(path) for line, path in entries["subcommands"].items()},
            outward_lines=tuple(entries.get("outward_lines", ())),
            background_lines=tuple(entries.get("background_lines", ())),
            guards=tuple(GuardEntry(guard["name"], EventPattern(guard["event"]), DottedPath(guard["path"]), guard["position"], guard["short_flag"], guard.get("is_confirmation", False))
                         for guard in entries["guards"]),
            listeners=tuple(ListenerEntry(listener["name"], EventPattern(listener["event"]), ListenerTiming(listener["timing"]), DottedPath(listener["path"]),
                                          listener["position"], listener["actor_id"]) for listener in entries["listeners"]),
            bindings={interface: DottedPath(path) for interface, path in entries["bindings"].items()},
            overlays=tuple(OverlayEntry(overlay["name"], DottedPath(overlay["path"]), overlay["position"], tuple(overlay["drivers"])) for overlay in entries.get("overlays", [])),
            rules=tuple(DriverRuleEntry(rule["name"], DottedPath(rule["path"]), rule["hook"], rule["position"], rule["owner"], tuple(rule["drivers"]), tuple(rule["roles"]),
                                        rule.get("exempt", rule.get("unsilenced", False)), rule["essential"], rule.get("history", False), rule.get("claims_essential", False),
                                        RoleGroup(rule.get("role_group", "any")), rule.get("priority", 0))
                        for rule in entries.get("rules", [])),
            suites=tuple(SuiteEntry(suite["name"], suite["module"], tuple(suite["requires"]), suite["defaults"], suite["complete_control"], tuple(suite["included_overlays"]),
                                    tuple(suite.get("windows", [])), {page: loaded_layout(shape) for page, shape in suite.get("layouts", {}).items()},
                                    {page: tuple(LayoutPreset(preset["key"], preset["name"], preset["text"], loaded_layout(preset["shape"])) for preset in presets)
                                     for page, presets in suite.get("presets", {}).items()},
                                    AgentPolicy(**{name: tuple(roles) for name, roles in suite.get("agent_policy", {}).items()}), suite.get("task_assigner", ""), suite.get("shipped", False))
                         for suite in entries.get("suites", [])),
            drivers=tuple(DriverEntry(driver["name"], DottedPath(driver["path"]), driver["module"], driver["suite"], driver["role"], tuple(driver["opening_lines"]),
                                      tuple(driver.get("guards", [])))
                          for driver in entries.get("drivers", [])),
            windows=tuple(WindowEntry(window["name"], window["module"], window["title"], window["entry"], window["loading"], LEGACY_PLACES.get(str(window["place"]), str(window["place"])), tuple(window["roles"]),
                                      tuple(window["reads"]), tuple(window["runs"]), tuple(window["events"]), window["shipped"], window["unavailable_reason"],
                                      window.get("icon", WindowIcon.WINDOW.value), window.get("float_width", DEFAULT_FLOAT_SIZE.width),
                                      window.get("float_height", DEFAULT_FLOAT_SIZE.height), tuple(window.get("options", [])), window.get("count", ""), tuple(window.get("shared_reads", [])), window.get("group", ""), window.get("auto_scroll", ""), tuple(window.get("tabs", [])), dict(window.get("search", {})), window.get("shows", LEGACY_SHOWS.get(window["place"], "environment")), tuple(window.get("skeleton", [])), tuple(window.get("required_settings", [])), tuple(window.get("sources", [])), dict(window.get("links", {})), tuple(window.get("slots", [])))
                          for window in entries.get("windows", [])),
            marks=tuple(MarkEntry.restored(mark) for mark in entries.get("marks", [])),
            nudges=tuple(NudgeEntry.restored(nudge) for nudge in entries.get("nudges", [])),
            docks=tuple(DockEntry.restored(dock) for dock in entries.get("docks", [])),
            templates=tuple(TemplateEntry.restored(template) for template in entries.get("templates", [])),
            buttons=tuple(ButtonEntry.restored(button) for button in entries.get("buttons", [])),
            inspectors=tuple(InspectorEntry.restored(inspector) for inspector in entries.get("inspectors", [])),
            state_additions=tuple(StateAdditionEntry.restored(addition) for addition in entries.get("state_additions", [])),
            helper_types=tuple(HelperTypeEntry.restored(entry) for entry in entries.get("helper_types", [])),
            agent_groups=tuple(AgentGroupEntry.restored(entry) for entry in entries.get("agent_groups", [])),
            profiles=tuple(ProfileEntry.restored(entry) for entry in entries.get("profiles", [])),
            button_slots=tuple(entries.get("button_slots", [])),
            inspector_slots=tuple(entries.get("inspector_slots", [])),
            events=tuple(entries.get("events", [])),
            event_keys={event: EventKeyEntry.restored(entry) for event, entry in entries.get("event_keys", {}).items()},
            former_event_keys=dict(entries.get("former_event_keys", {})),
            declared_plugin_events=tuple(entries.get("plugin_moments", [])),
            providers=tuple(ProviderEntry(provider["name"], DottedPath(provider["path"]), provider["module"], provider["title"]) for provider in entries.get("providers", [])),
            settings=tuple(SettingEntry.restored(setting) for setting in entries.get("settings", [])),
            shared_rows={model: DottedPath(path) for model, path in entries.get("shared_rows", {}).items()},
            library_shares={name: DottedPath(path) for name, path in entries.get("library_shares", {}).items()},
            tunnels=tuple(TunnelEntry(tunnel["name"], DottedPath(tunnel["path"]), tunnel["module"], tunnel["title"]) for tunnel in entries.get("tunnels", [])),
            skills=tuple(SkillEntry.restored(skill) for skill in entries.get("skills", [])),
            moves=tuple(MoveEntry.restored(move) for move in entries.get("moves", [])),
            module_fingerprints=dict(entries.get("module_fingerprints", {})),
            module_suites={module: tuple(suites) for module, suites in entries.get("module_suites", {}).items()},
        )

    def entries_text(self) -> str:
        return json.dumps({
            "events": list(self.events),
            "event_keys": {event: asdict(entry) for event, entry in self.event_keys.items()},
            "former_event_keys": self.former_event_keys,
            "plugin_moments": list(self.declared_plugin_events),
            "models":{cli_name: {"module": entry.module, "model": entry.model.text, "commands": list(entry.commands), "excluded_subcommands": list(entry.excluded_subcommands)} for cli_name, entry in self.models.items()},
            "handlers": {command: path.text for command, path in self.handlers.items()},
            "subcommands": {line: path.text for line, path in self.subcommands.items()},
            "outward_lines": list(self.outward_lines),
            "background_lines": list(self.background_lines),
            "guards": [{"name": guard.name, "event": guard.event.text, "path": guard.path.text, "position": guard.position, "short_flag": guard.short_flag, "is_confirmation": guard.is_confirmation}
                       for guard in self.guards],
            "listeners": [{"name": listener.name, "event": listener.event.text, "timing": listener.timing.value, "path": listener.path.text,
                           "position": listener.position, "actor_id": listener.actor_id} for listener in self.listeners],
            "bindings": {interface: path.text for interface, path in self.bindings.items()},
            "overlays": [{"name": overlay.name, "path": overlay.path.text, "position": overlay.position, "drivers": list(overlay.drivers)} for overlay in self.overlays],
            "rules": [{"name": rule.name, "path": rule.path.text, "hook": rule.hook, "position": rule.position, "owner": rule.owner, "drivers": list(rule.drivers),
                       "roles": list(rule.roles), "exempt": rule.exempt, "essential": rule.essential, "history": rule.history,
                       "claims_essential": rule.claims_essential, "role_group": rule.role_group.value, "priority": rule.priority} for rule in self.rules],
            "suites": [{"name": suite.name, "module": suite.module, "requires": list(suite.requires), "defaults": dict(suite.defaults), "complete_control": suite.complete_control,
                        "included_overlays": list(suite.included_overlays), "windows": list(suite.windows),
                        "agent_policy": asdict(suite.agent_policy), "task_assigner": suite.task_assigner, "shipped": suite.shipped,
                        "layouts": {page: stored_layout(shape) for page, shape in suite.layouts.items()},
                        "presets": {page: [{"key": preset.key, "name": preset.name, "text": preset.text, "shape": stored_layout(preset.shape)} for preset in presets]
                                    for page, presets in suite.presets.items()}} for suite in self.suites],
            "drivers": [{"name": driver.name, "path": driver.path.text, "module": driver.module, "suite": driver.suite, "role": driver.role,
                         "opening_lines": list(driver.opening_lines), "guards": list(driver.guards)} for driver in self.drivers],
            "windows": [{"name": window.name, "module": window.module, "title": window.title, "entry": window.entry, "loading": window.loading,
                         "place": window.place, "shows": window.shows, "roles": list(window.roles), "reads": list(window.reads), "runs": list(window.runs), "events": list(window.events),
                         "shipped": window.shipped, "unavailable_reason": window.unavailable_reason, "icon": window.icon,
                         "float_width": window.float_width, "float_height": window.float_height, "options": [dict(option) for option in window.options], "count": window.count, "shared_reads": list(window.shared_reads), "group": window.group, "auto_scroll": window.auto_scroll, "tabs": [dict(tab) for tab in window.tabs], "search": dict(window.search), "skeleton": [dict(part) for part in window.skeleton], "required_settings": list(window.required_settings), "sources": [dict(source) for source in window.sources], "links": dict(window.links), "slots": list(window.slots)} for window in self.windows],
            "marks": [asdict(mark) for mark in self.marks],
            "nudges": [asdict(nudge) for nudge in self.nudges],
            "docks": [asdict(dock) for dock in self.docks],
            "templates": [asdict(template) for template in self.templates],
            "buttons": [asdict(button) for button in self.buttons],
            "inspectors": [inspector.stored() for inspector in self.inspectors],
            "state_additions": [asdict(addition) for addition in self.state_additions],
            "helper_types": [asdict(entry) for entry in self.helper_types],
            "agent_groups": [asdict(entry) for entry in self.agent_groups],
            "profiles": [asdict(entry) for entry in self.profiles],
            "button_slots": list(self.button_slots),
            "inspector_slots": list(self.inspector_slots),
            "providers": [{"name": provider.name, "path": provider.path.text, "module": provider.module, "title": provider.title} for provider in self.providers],
            "settings": [asdict(setting) for setting in self.settings],
            "shared_rows": {model: path.text for model, path in self.shared_rows.items()},
            "library_shares": {name: path.text for name, path in self.library_shares.items()},
            "tunnels": [{"name": tunnel.name, "path": tunnel.path.text, "module": tunnel.module, "title": tunnel.title} for tunnel in self.tunnels],
            "skills": [asdict(skill) for skill in self.skills],
            "moves": [dict(move.stored()) for move in self.moves],
            "module_fingerprints": self.module_fingerprints,
            "module_suites": {module: list(suites) for module, suites in self.module_suites.items()},
        }, sort_keys=True)

    def with_overlays(self, overlays: tuple[OverlayEntry, ...]) -> "Registry":
        return replace(self, overlays=overlays)

    def with_rules(self, rules: tuple[DriverRuleEntry, ...]) -> "Registry":
        return replace(self, rules=rules)

    def essential_rules(self, driver: str, hook_name: str) -> list[DriverRuleEntry]:
        return [rule for rule in self.hook_rules(hook_name) if rule.is_driver_standing_rule(driver)]

    def overlay_rules(self, overlay: str, hook_name: str) -> list[DriverRuleEntry]:
        return [rule for rule in self.hook_rules(hook_name) if rule.owner == overlay and not rule.drivers]

    def driver_rules(self, driver: str, role: str, hook_name: str, suite_name: str) -> list[DriverRuleEntry]:
        suite = self.suite(suite_name)
        policy = suite.agent_policy if suite is not None else AgentPolicy()
        helper_types = self.helper_type_book()
        return [rule for rule in self.hook_rules(hook_name) if not rule.essential and not rule.exempt
                and rule.covers_driver(driver, role) and rule.role_group.has_role(role, policy, helper_types)]

    def hook_rules(self, hook_name: str) -> list[DriverRuleEntry]:
        return sorted((rule for rule in self.rules if rule.covers_hook(hook_name)), key=lambda rule: rule.position)

    def driver_overlays(self, driver: str) -> list[OverlayEntry]:
        return [overlay for overlay in self.overlays if overlay.covers(driver)]

    def bind(self, container: Container) -> None:
        for interface, implementation in self.bindings.items():
            container.substitute(DottedPath(interface).loaded(), implementation.loaded())

    def state_book(self) -> StateBook:
        return StateBook(tuple(entry.addition() for entry in self.state_additions))

    def agent_group_book(self) -> AgentGroupBook:
        return AgentGroupBook(self.agent_groups)

    def helper_type_book(self) -> HelperTypeBook:
        return HelperTypeBook(self.helper_types)

    def profile(self, name: str) -> ProfileEntry:
        for entry in self.profiles:
            if entry.profile.name == name:
                return entry
        raise Refusal(f"profile {name} is not registered", "register profiles on a module")

    def require_current(self, code_fingerprint: str) -> None:
        if code_fingerprint != self.fingerprint:
            raise StaleRegistryError("the journal's modules changed: journal module sync")

    @cached_property
    def event_lookup(self) -> EventLookup:
        return EventLookup(self.guards, self.listeners, self.events)

    @cached_property
    def key_event_names(self) -> dict[str, str]:
        return {entry.key: event for event, entry in self.event_keys.items()}

    def event_key(self, event: str) -> str:
        entry = self.event_keys.get(event)
        return entry.key if entry is not None else ""

    def event_name(self, key: str) -> str:
        visited: set[str] = set()
        while key not in self.key_event_names and key in self.former_event_keys and key not in visited:
            visited.add(key)
            key = self.former_event_keys[key]
        return self.key_event_names.get(key, "")

    def event_guards(self, event: str) -> tuple[GuardEntry, ...]:
        return self.event_lookup.matching_guards(event)

    def event_listeners(self, event: str, timing: ListenerTiming) -> tuple[ListenerEntry, ...]:
        return self.event_lookup.matching_listeners(event, timing)

    def has_handler(self, command: type) -> bool:
        return DottedPath.class_path(command).text in self.handlers

    def command_handler(self, command: type) -> DottedPath:
        return self.handlers[DottedPath.class_path(command).text]

    def suite(self, name: str) -> SuiteEntry | None:
        return next((suite for suite in self.suites if suite.name == name), None)

    @property
    def role_names(self) -> tuple[str, ...]:
        return tuple(self.helper_type_book().entries)

    @property
    def alias_permission_names(self) -> tuple[str, ...]:
        return tuple(dict.fromkeys(("agents", *(f"{role}s" for suite in self.suites for role in suite.agent_policy.restricted_alias_roles))))

    def button_lines(self, window: str) -> tuple[ButtonLine, ...]:
        if window == ButtonWindow.MARKS:
            return (*(ButtonLine(mark.module, button["runs"], mark.shipped, label=button["label"]) for mark in self.marks for button in (*mark.buttons, *mark.group_buttons)),
                    *(ButtonLine(dock.module, button["runs"], dock.shipped, label=button["label"]) for dock in self.docks for button in dock.buttons),
                    *(ButtonLine(button.module, action.runs, button.shipped, {item.name: item for item in action.fields}, action.label)
                      for button in self.buttons for action in (button.declaration, *button.declaration.menu)))
        if window == ButtonWindow.DOCK:
            return tuple(ButtonLine(dock.module, button["runs"], dock.shipped, label=button["label"]) for dock in self.docks for button in dock.buttons)
        return ()

    def subject_button_lines(self, subject: str) -> tuple[str, ...]:
        return tuple(button.permission_line for button in self.button_lines(ButtonWindow.MARKS) if button.subject == subject)

    def sharing_windows(self, model: str) -> tuple[WindowEntry, ...]:
        return tuple(window for window in self.windows if any(entry.split(" ", 1)[0] == model for entry in window.shared_reads))

    def dock(self, type_name: str) -> DockEntry | None:
        return next((dock for dock in self.docks if dock.type == type_name), None)

    def is_outward(self, line: str) -> bool:
        cli_name, _, subcommand = line.partition(" ")
        if line in self.subcommands:
            return line in self.outward_lines
        return cli_name in self.models and subcommand not in BUILT_READS

    def has_window(self, name: str) -> bool:
        return any(window.name == name for window in self.windows)

    def window(self, name: str) -> WindowEntry:
        return next(window for window in self.windows if window.name == name)

    def driver(self, name: str) -> DriverEntry | None:
        return next((driver for driver in self.drivers if driver.name == name), None)

    def top_suites(self) -> list[SuiteEntry]:
        return self.suite_roots(self.suites)

    def default_suite_roots(self) -> list[SuiteEntry]:
        return self.suite_roots([suite for suite in self.suites if suite.shipped])

    @staticmethod
    def suite_roots(suites: Sequence[SuiteEntry]) -> list[SuiteEntry]:
        required = {name for suite in suites for name in suite.requires}
        return [suite for suite in suites if suite.name not in required]

    # The suite's name and the names of every suite it requires, those they require too, nearest first.
    def ancestors(self, suite: SuiteEntry) -> tuple[str, ...]:
        names = [suite.name]
        for required in suite.requires:
            parent = self.suite(required)
            names.extend(name for name in (self.ancestors(parent) if parent is not None else [required]) if name not in names)
        return tuple(names)

    def suite_drivers(self, suite: SuiteEntry) -> list[DriverEntry]:
        return [driver for driver in self.drivers if driver.suite in self.ancestors(suite)]


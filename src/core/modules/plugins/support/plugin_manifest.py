from core.base.model.event_form import EventForm
from core.base.file_access import FileAccess
from core.base.file_version import FileVersion
import json
from collections.abc import Mapping
from dataclasses import dataclass, replace
from pathlib import Path
from functools import lru_cache

from core.base.journal_version import JOURNAL_VERSION
from core.base.refusal import Refusal
from core.modules.plugins.support.plugin_manifest_files import PluginManifestFiles
from core.base.type_guards import is_list, is_mapping
from core.modules.plugins.support.manifest_listener import SERVICE_PREFIX, ManifestListener
from core.modules.plugins.support.plugin_declared_event import PluginDeclaredEvent
from core.modules.plugins.support.plugin_answer import PluginAnswer
from core.modules.plugins.support.manifest_alias import ManifestAlias
from core.modules.plugins.support.manifest_config import ManifestConfig
from core.modules.plugins.support.manifest_dashboard import ManifestDashboard
from core.modules.plugins.support.manifest_service import ManifestService
from core.modules.plugins.support.manifest_setting import ManifestSetting
from core.modules.plugins.support.plugin_health import PluginHealth
from core.modules.plugins.support.plugin_requirement import PluginRequirement
from core.modules.plugins.support.setup_step import SetupStep
from core.modules.plugins.models.enums.service_restart import ServiceRestart
from core.modules.plugins.support.event_window import EventWindow

REQUIRED_FIELDS = ("name", "title", "version")


LINE_VERSION = 1


@dataclass(frozen=True)
class PluginManifest:
    """What a plugin folder says about itself in the manifest this journal version reads: its name,
    title and version, the program run for each event, the events it takes and the ones it answers
    inside a window, the settings its settings file lists, the tone of each type of card it shows, the
    folder of its skills, the services it keeps running, and what its install requires, sets up and
    reads back, how its services answer a health check, which helpers besides the main agent each
    event reaches, the aliases it ships, the dashboard it writes, what it says it is for, the folders of
    the project a limited agent's shell line may read for it, and the scripts it runs for event keys, and the stamp its own project hooks carry."""

    name: str
    title: str
    version: str
    program: str
    event_names: tuple[str, ...]
    event_windows: tuple[EventWindow, ...]
    settings: tuple[ManifestSetting, ...]
    files: tuple[str, ...]
    card_tones: Mapping[str, str]
    skills_folder: str
    services: tuple[ManifestService, ...]
    requirements: tuple[PluginRequirement, ...]
    setup_steps: tuple[SetupStep, ...]
    installed_command: str
    health: PluginHealth | None
    reaches: Mapping[str, tuple[str, ...]]
    aliases: tuple[ManifestAlias, ...]
    dashboard: ManifestDashboard | None
    description: str = ""
    project_reads: tuple[str, ...] = ()
    listeners: tuple[ManifestListener, ...] = ()
    declared_events: tuple[PluginDeclaredEvent, ...] = ()
    protocol: int = LINE_VERSION
    listed_files: tuple[str, ...] = ()
    config: ManifestConfig | None = None
    hook_stamp: str = ""

    @classmethod
    def read(cls, folder: Path) -> "PluginManifest":
        manifests = PluginManifestFiles.listed(folder)
        path = manifests.chosen(JOURNAL_VERSION)
        fields = cls.loaded_fields(path, FileAccess.shared().version(path))
        program = str(fields["program"]) if "program" in fields else ""
        settings_file = str(fields["settings"]) if "settings" in fields else ""
        names: object = fields["hears"] if "hears" in fields else None
        windows: object = fields["holds"] if "holds" in fields else None
        project_reads: object = fields["project_reads"] if "project_reads" in fields else None
        listed: object = fields["files"] if "files" in fields else None
        listeners = cls.read_listeners(fields["listen"], folder) if "listen" in fields else ()
        return cls(str(fields["name"]), str(fields["title"]), str(fields["version"]), program,
                   tuple(str(name) for name in names) if is_list(names) else (), tuple(cls.event_window(entry) for entry in windows) if is_list(windows) else (),
                   cls.read_settings(folder, settings_file), tuple(dict.fromkeys(file for file in (*manifests.names, program, settings_file, *(listener.allowed_script(form) for listener in listeners for form in EventForm), *cls.extra_files(listed, folder)) if file and not file.startswith(SERVICE_PREFIX))),
                   cls.read_card_tones(fields["cards"] if "cards" in fields else None), str(fields["skills"]) if "skills" in fields else "",
                   cls.read_services(fields["services"] if "services" in fields else None), cls.read_requirements(fields["requires"] if "requires" in fields else None),
                   cls.read_setup_steps(fields["setup"] if "setup" in fields else None), str(fields["installed"]) if "installed" in fields else "",
                   cls.read_health(fields["health"] if "health" in fields else None), cls.read_reaches(fields["reaches"] if "reaches" in fields else None),
                   cls.read_aliases(fields["aliases"] if "aliases" in fields else None), cls.read_dashboard(fields["dashboard"] if "dashboard" in fields else None),
                   str(fields["description"]) if "description" in fields else "",
                   tuple(str(entry) for entry in project_reads) if is_list(project_reads) else (), listeners, (), cls.read_protocol(fields["protocol"] if "protocol" in fields else None), cls.read_listed_files(listed),
                   cls.read_config(fields["config"] if "config" in fields else None), str(fields["hook_stamp"]) if "hook_stamp" in fields else "")

    @classmethod
    def loaded_fields(cls, path: Path, version: FileVersion) -> Mapping[str, object]:
        fields = cls.kept_fields(path, version)
        if isinstance(fields, Refusal):
            raise fields
        return fields

    @classmethod
    @lru_cache(maxsize=128)
    def kept_fields(cls, path: Path, version: FileVersion) -> Mapping[str, object] | Refusal:
        try:
            fields: object = json.loads(FileAccess.shared().read(path))
        except json.JSONDecodeError as error:
            return Refusal(f"the manifest {path} is not valid JSON: {error}", "correct the file, or remove and install the plugin again")
        if not is_mapping(fields) or not all(field in fields for field in REQUIRED_FIELDS):
            return Refusal(f"the manifest {path} lacks one of {', '.join(REQUIRED_FIELDS)}", "a plugin manifest states its name, title and version")
        return fields

    @staticmethod
    def read_config(config: object) -> ManifestConfig | None:
        if not is_mapping(config) or "file" not in config or "schema" not in config:
            return None
        return ManifestConfig(str(config["file"]), str(config["schema"]))

    @staticmethod
    def read_dashboard(dashboard: object) -> ManifestDashboard | None:
        if not is_mapping(dashboard) or "name" not in dashboard:
            return None
        event_keys = dashboard["events"] if "events" in dashboard else ()
        return ManifestDashboard(str(dashboard["name"]), str(dashboard["title"]) if "title" in dashboard else str(dashboard["name"]),
                                 tuple(str(key) for key in event_keys) if is_list(event_keys) else ())

    @staticmethod
    def read_aliases(aliases: object) -> tuple[ManifestAlias, ...]:
        parsed = [ManifestAlias.parsed(entry) for entry in aliases] if is_list(aliases) else []
        return tuple(alias for alias in parsed if alias is not None)

    @staticmethod
    def read_reaches(reaches: object) -> dict[str, tuple[str, ...]]:
        entries = [(str(event), roles) for event, roles in reaches.items() if is_list(roles)] if is_mapping(reaches) else []
        return {event: tuple(str(role) for role in roles) for event, roles in entries}

    @staticmethod
    def read_health(health: object) -> "PluginHealth | None":
        if not is_mapping(health) or not all(key in health for key in ("socket_env", "request", "answer")):
            return None
        return PluginHealth(str(health["socket_env"]), str(health["request"]), str(health["answer"]))

    @staticmethod
    def read_requirements(requires: object) -> tuple[PluginRequirement, ...]:
        entries = [(str(name), entry) for name, entry in requires.items() if is_mapping(entry)] if is_mapping(requires) else []
        return tuple(PluginRequirement(name, str(entry["check"]) if "check" in entry else f"command -v {name}", str(entry["hint"]) if "hint" in entry else "")
                     for name, entry in entries)

    @staticmethod
    def read_setup_steps(setup: object) -> tuple[SetupStep, ...]:
        entries = [entry for entry in setup if is_mapping(entry) and "run" in entry] if is_list(setup) else []
        return tuple(SetupStep(str(entry["name"]) if "name" in entry else str(entry["run"]), str(entry["run"])) for entry in entries)

    @staticmethod
    def restart_rule(restart: object) -> ServiceRestart:
        return ServiceRestart(restart) if restart in [rule.value for rule in ServiceRestart] else ServiceRestart.STOPPED_END

    @classmethod
    def read_services(cls, services: object) -> tuple[ManifestService, ...]:
        entries = [entry for entry in services if is_mapping(entry) and "name" in entry and "command" in entry and is_list(entry["command"])] if is_list(services) else []
        return tuple(ManifestService(str(entry["name"]), tuple(str(part) for part in command) if is_list(command := entry["command"]) else (),
                                     str(entry["when"]) if "when" in entry else "", cls.restart_rule(entry["restart"] if "restart" in entry else None),
                                     entry["answers"] is True if "answers" in entry else False) for entry in entries)

    @staticmethod
    def read_card_tones(cards: object) -> dict[str, str]:
        entries = [entry for entry in cards if is_mapping(entry) and PluginAnswer.entry_type(entry)] if is_list(cards) else []
        return {PluginAnswer.entry_type(entry): str(entry["tone"]) if "tone" in entry else "" for entry in entries}

    @staticmethod
    def read_listed_files(listed: object) -> tuple[str, ...]:
        return tuple(str(entry) for entry in listed) if is_list(listed) else ()

    @classmethod
    def extra_files(cls, listed: object, folder: Path) -> tuple[str, ...]:
        return tuple(name for entry in cls.read_listed_files(listed) if ManifestListener.is_contained_path(entry, folder) for name in cls.walked_files(folder, entry))

    @staticmethod
    def walked_files(folder: Path, entry: str) -> tuple[str, ...]:
        path = folder / entry
        if not path.is_dir():
            return tuple([entry])
        return tuple(sorted(str(file.relative_to(folder)) for file in path.rglob("*") if file.is_file()))

    def wrong_files(self, folder: Path) -> tuple[str, ...]:
        return tuple(entry for entry in self.listed_files if not ManifestListener.is_contained_path(entry, folder))

    @staticmethod
    def read_protocol(protocol: object) -> int:
        return protocol if isinstance(protocol, int) and not isinstance(protocol, bool) else LINE_VERSION

    @property
    def needs_newer_journal(self) -> bool:
        return self.protocol > LINE_VERSION

    @staticmethod
    def read_listeners(listen: object, folder: Path) -> tuple[ManifestListener, ...]:
        return tuple(ManifestListener.parsed(entry, folder) for entry in listen) if is_list(listen) else tuple([ManifestListener(str(listen), is_wrong=True)])

    @staticmethod
    def event_window(entry: object) -> EventWindow:
        if is_mapping(entry) and "event" in entry:
            window: object = entry["window_ms"] if "window_ms" in entry else 0
            return EventWindow(str(entry["event"]), window if isinstance(window, int) else 0)
        return EventWindow(str(entry), 0)

    @classmethod
    def read_settings(cls, folder: Path, settings_file: str) -> tuple[ManifestSetting, ...]:
        if not settings_file:
            return ()
        path = folder / settings_file
        return cls.loaded_settings(path, FileAccess.shared().version(path))

    @classmethod
    @lru_cache(maxsize=128)
    def loaded_settings(cls, path: Path, version: FileVersion) -> tuple[ManifestSetting, ...]:
        listed: object = json.loads(FileAccess.shared().read(path))
        return tuple(cls.manifest_setting(entry) for entry in listed) if is_list(listed) else ()

    @staticmethod
    def manifest_setting(entry: object) -> ManifestSetting:
        if not is_mapping(entry) or not all(field in entry for field in ("key", "title")) or not PluginAnswer.entry_type(entry):
            raise Refusal("a setting of a plugin's settings file lacks its key, title or type", "each setting states all three")
        choices: object = entry["choices"] if "choices" in entry else None
        return ManifestSetting(str(entry["key"]), str(entry["title"]), PluginAnswer.entry_type(entry), entry["default"] if "default" in entry else None,
                               tuple(str(choice) for choice in choices) if is_list(choices) else (), str(entry.get("help", "")), str(entry.get("group", "")), str(entry.get("parent", "")))

    def setting(self, key: str) -> ManifestSetting:
        matching = [setting for setting in self.settings if setting.key == key]
        if not matching:
            raise Refusal(f"{self.name} has no setting {key}: it has {', '.join(setting.key for setting in self.settings) or 'none'}", "journal plugin settings shows them")
        return matching[0]

    def reaches_role(self, event: str, role: str) -> bool:
        return event in self.reaches and any(name in self.reaches[event] for name in (role, f"{role}s"))

    def window_names(self) -> tuple[str, ...]:
        return tuple(window.event for window in self.event_windows)

    def window_ms(self, event: str, ceiling_ms: int) -> int:
        limits = [window.window_ms for window in self.event_windows if window.event == event and window.window_ms > 0]
        return min(limits[0], ceiling_ms) if limits else ceiling_ms

    def with_declared_events(self, keys: Mapping[str, str]) -> "PluginManifest":
        declared_events = tuple(PluginDeclaredEvent(keys[listener.event], listener.event, form, listener.allowed_script(form)) for listener in self.listeners if listener.event in keys
                        for form in (EventForm.GUARD, EventForm.COMMIT) if listener.allowed_script(form))
        if not declared_events:
            return self
        names = tuple(dict.fromkeys((*self.event_names, *(declared_event.event for declared_event in declared_events))))
        windows = tuple(EventWindow(declared_event.event, 0) for declared_event in declared_events if declared_event.form is EventForm.GUARD and declared_event.event not in self.window_names())
        return replace(self, event_names=names, event_windows=(*self.event_windows, *windows), declared_events=declared_events)

    def declared_event(self, event: str, form: EventForm) -> PluginDeclaredEvent | None:
        return next((declared_event for declared_event in self.declared_events if declared_event.event == event and declared_event.form is form), None)

    def script(self, key: str, form: EventForm) -> str:
        return next((listener.allowed_script(form) for listener in self.listeners if listener.event == key and listener.script(form)), "")

    def answers_as(self, script: str) -> bool:
        name = script.removeprefix(SERVICE_PREFIX)
        return any(service.name == name and service.answers for service in self.services)

    def allows_skip(self, key: str) -> bool:
        return all(listener.allows_skip for listener in self.listeners if listener.event == key)

    def listen_window_ms(self, key: str) -> int | None:
        return min((listener.window_ms for listener in self.listeners if listener.event == key and listener.window_ms is not None), default=None)

    def project_folders(self, project_root: Path, journal_folder: Path) -> tuple[Path, ...]:
        real_root, real_journal = project_root.resolve(), journal_folder.resolve()
        folders = ((real_root / entry).resolve() for entry in self.project_reads if not Path(entry).is_absolute())
        return tuple(folder for folder in folders if folder != real_root and folder.is_relative_to(real_root) and not folder.is_relative_to(real_journal))

    def run_rows(self) -> list[Mapping[str, str]]:
        entries = [("requires", requirement.name, requirement.check) for requirement in self.requirements]
        entries += [("setup", step.name, step.line) for step in self.setup_steps]
        entries += [("files", entry, entry) for entry in self.listed_files]
        if self.installed_command:
            entries.append(("installed", "Asked for its settings", self.installed_command))
        if self.program:
            entries.append(("program", ", ".join(self.event_names) or "No events", self.program))
        entries += [("service", service.name, " ".join(service.command)) for service in self.services]
        entries += [("alias", alias.name, alias.line) for alias in self.aliases]
        entries += [("reads", "Project folder", folder) for folder in self.project_reads]
        entries += [(form.value, listener.event, listener.script(form)) for listener in self.listeners for form in EventForm if listener.script(form)]
        return [{"category": category, "label": label, "command": command} for category, label, command in entries]

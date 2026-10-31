import json
from collections.abc import Mapping
from dataclasses import dataclass
from pathlib import Path

from core.base.refusal import Refusal
from core.base.type_guards import is_list, is_mapping
from core.modules.plugins.support.manifest_service import ManifestService
from core.modules.plugins.support.manifest_setting import ManifestSetting
from core.modules.plugins.support.plugin_health import PluginHealth
from core.modules.plugins.support.plugin_requirement import PluginRequirement
from core.modules.plugins.support.setup_step import SetupStep
from core.modules.plugins.support.event_window import EventWindow

MANIFEST_FILE = "journal-plugin.json"
REQUIRED_FIELDS = ("name", "title", "version")


@dataclass(frozen=True)
class PluginManifest:
    """What a plugin folder says about itself in journal-plugin.json, as version 4 reads it: its name, title and
    version, the program run for each event, the events it takes and the ones it answers inside a window, the
    settings its settings file lists, the tone of each kind of card it shows, the folder of its skills, the services it keeps running, and what its
    install requires, sets up and reads back, and how its services answer a health check."""

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

    @classmethod
    def read(cls, folder: Path) -> "PluginManifest":
        path = folder / MANIFEST_FILE
        if not path.is_file():
            raise Refusal(f"{folder} contains no plugin: {MANIFEST_FILE} is missing", "name the folder of a plugin")
        fields: object = json.loads(path.read_text())
        if not is_mapping(fields) or not all(field in fields for field in REQUIRED_FIELDS):
            raise Refusal(f"the manifest {path} lacks one of {', '.join(REQUIRED_FIELDS)}", "a plugin manifest states its name, title and version")
        program = str(fields["program"]) if "program" in fields else ""
        settings_file = str(fields["settings"]) if "settings" in fields else ""
        names: object = fields["hears"] if "hears" in fields else None
        windows: object = fields["holds"] if "holds" in fields else None
        return cls(str(fields["name"]), str(fields["title"]), str(fields["version"]), program,
                   tuple(str(name) for name in names) if is_list(names) else (), tuple(cls.event_window(entry) for entry in windows) if is_list(windows) else (),
                   cls.read_settings(folder, settings_file), tuple(file for file in (MANIFEST_FILE, program, settings_file) if file),
                   cls.read_card_tones(fields["cards"] if "cards" in fields else None), str(fields["skills"]) if "skills" in fields else "",
                   cls.read_services(fields["services"] if "services" in fields else None), cls.read_requirements(fields["requires"] if "requires" in fields else None),
                   cls.read_setup_steps(fields["setup"] if "setup" in fields else None), str(fields["installed"]) if "installed" in fields else "",
                   cls.read_health(fields["health"] if "health" in fields else None))

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
    def read_services(services: object) -> tuple[ManifestService, ...]:
        entries = [entry for entry in services if is_mapping(entry) and "name" in entry and "command" in entry and is_list(entry["command"])] if is_list(services) else []
        return tuple(ManifestService(str(entry["name"]), tuple(str(part) for part in command) if is_list(command := entry["command"]) else (),
                                     str(entry["when"]) if "when" in entry else "", str(entry["restart"]) if "restart" in entry else "never",
                                     entry["answers"] is True if "answers" in entry else False) for entry in entries)

    @staticmethod
    def read_card_tones(cards: object) -> dict[str, str]:
        entries = [entry for entry in cards if is_mapping(entry) and "kind" in entry] if is_list(cards) else []
        return {str(entry["kind"]): str(entry["tone"]) if "tone" in entry else "" for entry in entries}

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
        listed: object = json.loads((folder / settings_file).read_text())
        return tuple(cls.manifest_setting(entry) for entry in listed) if is_list(listed) else ()

    @staticmethod
    def manifest_setting(entry: object) -> ManifestSetting:
        if not is_mapping(entry) or not all(field in entry for field in ("key", "title", "kind")):
            raise Refusal("a setting of a plugin's settings file lacks its key, title or kind", "each setting states all three")
        choices: object = entry["choices"] if "choices" in entry else None
        return ManifestSetting(str(entry["key"]), str(entry["title"]), str(entry["kind"]), entry["default"] if "default" in entry else None,
                               tuple(str(choice) for choice in choices) if is_list(choices) else ())

    def setting(self, key: str) -> ManifestSetting:
        matching = [setting for setting in self.settings if setting.key == key]
        if not matching:
            raise Refusal(f"{self.name} has no setting {key}: it has {', '.join(setting.key for setting in self.settings) or 'none'}", "journal plugin settings shows them")
        return matching[0]

    def window_names(self) -> tuple[str, ...]:
        return tuple(window.event for window in self.event_windows)

    def window_ms(self, event: str, ceiling_ms: int) -> int:
        limits = [window.window_ms for window in self.event_windows if window.event == event and window.window_ms > 0]
        return min(limits[0], ceiling_ms) if limits else ceiling_ms

import json
from dataclasses import dataclass
from pathlib import Path

from core.base.refusal import Refusal
from core.base.type_guards import is_mapping
from core.modules.plugins.support.manifest_setting import ManifestSetting

MANIFEST_PATH = Path(".journal-plugin") / "plugin.json"
REQUIRED_FIELDS = ("name", "title", "version")


@dataclass(frozen=True)
class PluginManifest:
    """What a plugin folder says about itself in .journal-plugin/plugin.json: its name, title, version and settings."""

    name: str
    title: str
    version: str
    settings: tuple[ManifestSetting, ...]

    @classmethod
    def read(cls, folder: Path) -> "PluginManifest":
        path = folder / MANIFEST_PATH
        if not path.is_file():
            raise Refusal(f"{folder} contains no plugin: {MANIFEST_PATH} is missing", "name the folder of a plugin")
        fields: object = json.loads(path.read_text())
        if not is_mapping(fields) or not all(field in fields for field in REQUIRED_FIELDS):
            raise Refusal(f"the manifest {path} lacks one of {', '.join(REQUIRED_FIELDS)}", "a plugin manifest states its name, title and version")
        declared: object = fields["settings"] if "settings" in fields else None
        settings = tuple(cls.manifest_setting(str(key), entry) for key, entry in declared.items()) if is_mapping(declared) else ()
        return cls(str(fields["name"]), str(fields["title"]), str(fields["version"]), settings)

    @staticmethod
    def manifest_setting(key: str, entry: object) -> ManifestSetting:
        if not is_mapping(entry) or "title" not in entry or "type" not in entry:
            raise Refusal(f"the setting {key} of a plugin manifest lacks its title or its type", "each setting states both")
        return ManifestSetting(key, str(entry["title"]), str(entry["type"]), entry["default"] if "default" in entry else None)

    def setting(self, key: str) -> ManifestSetting:
        matching = [setting for setting in self.settings if setting.key == key]
        if not matching:
            raise Refusal(f"{self.name} has no setting {key}: it has {', '.join(setting.key for setting in self.settings) or 'none'}", "journal plugin settings shows them")
        return matching[0]

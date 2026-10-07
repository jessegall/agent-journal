from pathlib import Path

from engine.stored import read_json, write_json
from resources.base import ENVIRONMENT, PROJECT

SETTINGS: dict[str, tuple] = {}
SETTINGS_VERSION = [0]
MERGED: dict[str, tuple] = {}


class SettingsFile:
    def __init__(self, home: Path):
        self.file = home / "settings.json"

    def held(self) -> tuple:
        if str(self.file) not in SETTINGS:
            self.reread()
        return SETTINGS[str(self.file)]

    def reread(self) -> None:
        SETTINGS_VERSION[0] += 1
        SETTINGS[str(self.file)] = (SETTINGS_VERSION[0], read_json(self.file, dict, {}))

    def write(self, key: str, value) -> bool:
        """Writes the key and says whether its value changed."""
        held = read_json(self.file, dict, {})
        if key in held and held[key] == value:
            return False
        write_json(self.file, {**held, key: value}, indent=2)
        return True


class ProjectParts:
    """The parts of each settings key kept once for the project, in <root>/settings.json, instead of per environment."""

    def __init__(self):
        self.kept: dict[str, frozenset[str]] = {}
        self.version = 0

    def keep(self, key: str, *parts: str) -> None:
        self.kept[key] = self.of(key) | frozenset(parts)
        self.version += 1

    def of(self, key: str) -> frozenset[str]:
        return self.kept.get(key, frozenset())

    def split(self, key: str, value) -> dict[str, object]:
        parts = self.of(key)
        if not parts or not isinstance(value, dict):
            return {ENVIRONMENT: value}
        return {PROJECT: {k: v for k, v in value.items() if k in parts}, ENVIRONMENT: {k: v for k, v in value.items() if k not in parts}}

    def merged(self, own: dict, project: dict) -> dict:
        out = dict(own)
        for key, parts in self.kept.items():
            if key not in own and key not in project:
                continue
            mine, shared = own.get(key), project.get(key)
            out[key] = {**{k: v for k, v in (mine if isinstance(mine, dict) else {}).items() if k not in parts},
                        **{k: v for k, v in (shared if isinstance(shared, dict) else {}).items() if k in parts}}
        return out


PROJECT_PARTS = ProjectParts()


class ScopedSettings:
    """An environment's settings with the project's parts laid over them: one source for each part."""

    def __init__(self, home: Path, root: Path):
        self.files = {ENVIRONMENT: SettingsFile(home), PROJECT: SettingsFile(root)}

    def held(self) -> tuple:
        own, project = self.files[ENVIRONMENT].held(), self.files[PROJECT].held()
        version = (own[0], project[0], PROJECT_PARTS.version)
        key = str(self.files[ENVIRONMENT].file)
        if MERGED.get(key, (None,))[0] != version:
            MERGED[key] = (version, PROJECT_PARTS.merged(own[1], project[1]))
        return MERGED[key]

    def reread(self) -> None:
        for file in self.files.values():
            file.reread()

    def write(self, key: str, value, locked) -> bool:
        """Writes each part of the value to the file of its scope, and says whether the project's part changed."""
        changed = {}
        for scope, part in PROJECT_PARTS.split(key, value).items():
            with locked(scope):
                changed[scope] = self.files[scope].write(key, part)
        return changed.get(PROJECT, False)

from pathlib import Path

from engine.stored import read_json, write_json

SETTINGS: dict[str, tuple] = {}
SETTINGS_VERSION = [0]


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

    def write(self, key: str, value) -> None:
        write_json(self.file, {**read_json(self.file, dict, {}), key: value}, indent=2)

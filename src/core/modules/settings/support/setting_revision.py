import hashlib
import json

from core.modules.settings.support.setting_reader import SettingReader


class SettingRevision:
    """A short stamp of what a setting reads as here: the value that applies and where it comes from, and the value
    the whole project holds. A change to either gives a different stamp."""

    def __init__(self, values: SettingReader) -> None:
        self.values = values

    def current(self, key: str) -> str:
        here, project = self.values.current(key), self.values.project(key)
        return hashlib.sha256(json.dumps([here.value, here.source, project.value, project.source], default=str).encode()).hexdigest()[:12]

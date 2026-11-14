from contextlib import AbstractContextManager

from core.modules.settings.support.setting_reader import SettingReader
from engine.setting.setting_source import SettingSource


class ReaderSettingSource(SettingSource):
    """Gives the engine's setting values the settings module's one reader, so both read and keep the same rows."""

    def __init__(self, reader: SettingReader) -> None:
        self.reader = reader

    def current_value(self, key: str) -> object:
        return self.reader.current(key).value

    def project_value(self, key: str) -> object:
        return self.reader.project(key).value

    def keep_rows(self) -> AbstractContextManager[None]:
        return self.reader.keep_rows()

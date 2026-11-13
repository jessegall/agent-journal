from collections.abc import Iterator
from contextlib import contextmanager

from engine.setting.setting_source import SettingSource


class SampleSettings(SettingSource):
    """Setting values a unit test sets by key; a key it never set reads as 0."""

    def __init__(self) -> None:
        self.values: dict[str, object] = {}

    def current_value(self, key: str) -> object:
        return self.values.get(key, 0)

    def project_value(self, key: str) -> object:
        return self.current_value(key)

    @contextmanager
    def keep_rows(self) -> Iterator[None]:
        yield

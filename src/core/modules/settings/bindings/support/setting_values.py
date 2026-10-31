from collections.abc import Generator
from contextlib import contextmanager

from core.base.type_guards import is_list, is_tuple
from core.modules.settings.support.setting_reader import SettingReader


class SettingValues:
    """How modules read their settings: a declared key's value for an environment, else for the project, else
    its declared default, as the type the reader needs. Reading a key no module declares raises a refusal
    naming it."""

    def __init__(self, values: SettingReader) -> None:
        self.values = values

    @contextmanager
    def keep_rows(self) -> Generator[None]:
        with self.values.keep_rows():
            yield

    def value(self, key: str, environment_id: int | None) -> object:
        return self.values.current(key, environment_id).value

    def project_value(self, key: str) -> object:
        return self.value(key, None)

    def text(self, key: str, environment_id: int | None) -> str:
        value = self.value(key, environment_id)
        return value if isinstance(value, str) else ""

    def texts(self, key: str, environment_id: int | None) -> tuple[str, ...]:
        value = self.value(key, environment_id)
        return tuple(str(item) for item in value) if is_list(value) or is_tuple(value) else ()

    def numbers(self, key: str, environment_id: int | None) -> tuple[int, ...]:
        value = self.value(key, environment_id)
        return tuple(item for item in value if isinstance(item, int)) if is_list(value) or is_tuple(value) else ()

    def number(self, key: str, environment_id: int | None) -> int:
        value = self.value(key, environment_id)
        return value if isinstance(value, int) and not isinstance(value, bool) else 0

    def flag(self, key: str, environment_id: int | None) -> bool:
        return self.value(key, environment_id) is True

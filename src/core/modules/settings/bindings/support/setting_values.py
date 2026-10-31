from collections.abc import Generator
from contextlib import contextmanager

from core.base.type_guards import is_list, is_tuple
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_type_error import SettingTypeError


class SettingValues:
    """How modules read their settings: a declared key's value for an environment, else for the project, else
    its declared default, as the type the reader needs; a stored value of another type raises, since setting
    set checks every value against its type."""

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
        if not isinstance(value, str):
            raise SettingTypeError(f"{key} holds {value!r}, not text")
        return value

    def texts(self, key: str, environment_id: int | None) -> tuple[str, ...]:
        value = self.value(key, environment_id)
        if not (is_list(value) or is_tuple(value)) or not all(isinstance(item, str) for item in value):
            raise SettingTypeError(f"{key} holds {value!r}, not a list of text")
        return tuple(str(item) for item in value)

    def numbers(self, key: str, environment_id: int | None) -> tuple[int, ...]:
        value = self.value(key, environment_id)
        if not (is_list(value) or is_tuple(value)) or not all(isinstance(item, int) and not isinstance(item, bool) for item in value):
            raise SettingTypeError(f"{key} holds {value!r}, not a list of numbers")
        return tuple(int(str(item)) for item in value)

    def number(self, key: str, environment_id: int | None) -> int:
        value = self.value(key, environment_id)
        if not isinstance(value, int) or isinstance(value, bool):
            raise SettingTypeError(f"{key} holds {value!r}, not a whole number")
        return value

    def flag(self, key: str, environment_id: int | None) -> bool:
        value = self.value(key, environment_id)
        if not isinstance(value, bool):
            raise SettingTypeError(f"{key} holds {value!r}, not on or off")
        return value

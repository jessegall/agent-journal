from collections.abc import Generator
from contextlib import contextmanager
from copy import copy
from typing import TypeVar

from core.base.driver.seconds import Seconds
from engine.types.type_guards import is_list, is_tuple
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_type_error import SettingTypeError

T = TypeVar("T")


class SettingValues:
    """How modules read their settings: a declared key's value for an environment, else for the project, else
    its declared default, as the type the reader needs; a stored value of another type raises, since setting
    set checks every value against its type."""

    def __init__(self, values: SettingReader) -> None:
        self.values = values
        self.reads = values.current

    @property
    def project(self) -> "SettingValues":
        project_values = copy(self)
        project_values.reads = self.values.project
        return project_values

    @contextmanager
    def keep_rows(self) -> Generator[None]:
        with self.values.keep_rows():
            yield

    def value(self, key: str) -> object:
        return self.reads(key).value

    def project_value(self, key: str) -> object:
        return self.values.project(key).value

    def text(self, key: str) -> str:
        return self.typed(key, str, "text")

    def texts(self, key: str) -> tuple[str, ...]:
        value = self.value(key)
        if not (is_list(value) or is_tuple(value)) or not all(isinstance(item, str) for item in value):
            raise SettingTypeError(f"{key} holds {value!r}, not a list of text")
        return tuple(str(item) for item in value)

    def numbers(self, key: str) -> tuple[int, ...]:
        value = self.value(key)
        if not (is_list(value) or is_tuple(value)) or not all(isinstance(item, int) and not isinstance(item, bool) for item in value):
            raise SettingTypeError(f"{key} holds {value!r}, not a list of numbers")
        return tuple(int(str(item)) for item in value)

    def number(self, key: str) -> int:
        return self.typed(key, int, "a whole number")

    def decimal(self, key: str) -> float:
        value = self.value(key)
        if isinstance(value, bool) or not isinstance(value, int | float):
            raise SettingTypeError(f"{key} holds {value!r}, not a number")
        return float(value)

    def seconds(self, key: str) -> Seconds:
        return Seconds(self.number(key))

    def minutes(self, key: str) -> Seconds:
        return Seconds.minutes(self.number(key))

    def flag(self, key: str) -> bool:
        return self.typed(key, bool, "on or off")

    def typed(self, key: str, value_type: type[T], label: str) -> T:
        value = self.value(key)
        if not isinstance(value, value_type) or (isinstance(value, bool) and value_type is not bool):
            raise SettingTypeError(f"{key} holds {value!r}, not {label}")
        return value

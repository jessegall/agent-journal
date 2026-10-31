import json
from collections.abc import Callable, Sequence, Generator
from contextlib import contextmanager
from typing import TypeVar

from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.type_guards import is_list
from core.modules.settings.models.setting import Setting

T = TypeVar("T")


class SettingValues:
    """The one reader of the settings table: a key's value for an environment, else for the whole project, else
    the default the caller gives. Inside keep_rows(), a row is read once and kept, for a stretch in which
    nothing writes a setting."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries
        self.rows: dict[tuple[str, int | None], Setting | None] | None = None

    @contextmanager
    def keep_rows(self) -> Generator[None]:
        self.rows = {}
        try:
            yield
        finally:
            self.rows = None

    def value(self, key: str, environment_id: int, default: object) -> object:
        setting = self.row(key, environment_id)
        return json.loads(setting.value) if setting is not None else self.project_value(key, default)

    def row(self, key: str, environment_id: int) -> Setting | None:
        return self.found((key, environment_id), lambda: self.queries.query(Setting).filter(key=key, environment_id=environment_id).page(1, 1).rows)

    def project_value(self, key: str, default: object) -> object:
        setting = self.found((key, None), lambda: self.queries.query(Setting).filter(key=key).matching(IsNull("environment_id")).page(1, 1).rows)
        return json.loads(setting.value) if setting is not None else default

    def found(self, address: tuple[str, int | None], read: Callable[[], Sequence[Setting]]) -> Setting | None:
        if self.rows is not None and address in self.rows:
            return self.rows[address]
        rows = read()
        setting = rows[0] if rows else None
        if self.rows is not None:
            self.rows[address] = setting
        return setting

    def numbers(self, key: str, environment_id: int, default: tuple[int, ...]) -> tuple[int, ...]:
        return self.items(key, environment_id, default, int)

    def texts(self, key: str, environment_id: int, default: tuple[str, ...]) -> tuple[str, ...]:
        return self.items(key, environment_id, default, str)

    def items(self, key: str, environment_id: int, default: tuple[T, ...], item_type: type[T]) -> tuple[T, ...]:
        value = self.value(key, environment_id, default)
        return tuple(item for item in value if isinstance(item, item_type)) if is_list(value) else default

    def text(self, key: str, environment_id: int, default: str) -> str:
        value = self.value(key, environment_id, default)
        return value if isinstance(value, str) else default

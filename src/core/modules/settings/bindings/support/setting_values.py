import json
from typing import TypeVar

from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.type_guards import is_list
from core.modules.settings.models.setting import Setting

T = TypeVar("T")


class SettingValues:
    """The one reader of the settings table: a key's value for an environment, else for the whole project, else
    the default the caller gives."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def value(self, key: str, environment_id: int, default: object) -> object:
        setting = self.row(key, environment_id)
        return json.loads(setting.value) if setting is not None else self.project_value(key, default)

    def row(self, key: str, environment_id: int) -> Setting | None:
        rows = self.queries.query(Setting).filter(key=key, environment_id=environment_id).page(1, 1).rows
        return rows[0] if rows else None

    def project_value(self, key: str, default: object) -> object:
        rows = self.queries.query(Setting).filter(key=key).matching(IsNull("environment_id")).page(1, 1).rows
        return json.loads(rows[0].value) if rows else default

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

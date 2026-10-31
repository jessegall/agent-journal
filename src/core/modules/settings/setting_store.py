import json

from core.base.command.context import Context
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.settings.setting import Setting


class SettingStore:
    """Writes a setting for one environment, or for the whole project with no environment: its row's value written
    over, or a new row."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def write(self, key: str, value: object, environment_id: int | None, context: Context) -> Setting:
        query = self.queries.query(Setting).filter(key=key)
        rows = (query.matching(IsNull("environment_id")) if environment_id is None else query.filter(environment_id=environment_id)).page(1, 1).rows
        setting = Setting(environment_id=environment_id, creator_id=context.actor.id, key=key, value=json.dumps(value))
        return self.repository.save_over(rows[0] if rows else None, setting, context)

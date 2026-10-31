import json
from dataclasses import replace

from core.base.command.context import Context
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.settings.setting import Setting


class SettingStore:
    """Writes a setting for one environment: its row's value written anew, or a new row."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def write(self, key: str, value: object, environment_id: int, context: Context) -> Setting:
        rows = self.queries.query(Setting).filter(key=key, environment_id=environment_id).page(1, 1).rows
        if rows:
            return self.repository.save(replace(rows[0], value=json.dumps(value)), context)
        return self.repository.save(Setting(environment_id=environment_id, creator_id=context.actor.id, key=key, value=json.dumps(value)), context)

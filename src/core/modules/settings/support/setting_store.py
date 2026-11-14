import json

from engine.command.context import Context
from engine.errors.refusal import Refusal
from engine.registry.setting_entry import SettingEntry
from engine.enums.setting_scope import SettingScope
from engine.repository.repository import Repository
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_rows import SettingRows


class SettingStore:
    """The one writer of settings: a value for one environment, or for the whole project with no environment,
    written over its row or as a new row; a secret goes to the secret settings table as its text."""

    def __init__(self, rows: SettingRows, repository: Repository, reader: SettingReader) -> None:
        self.rows, self.repository, self.reader = rows, repository, reader

    def write(self, key: str, value: object, environment_id: int | None, context: Context) -> Setting:
        setting = Setting(environment_id=environment_id, creator_id=context.actor.id, key=key, value=json.dumps(value))
        existing = self.rows.row(Setting, key, environment_id)
        self.reader.clear()
        return self.repository.merge(existing if isinstance(existing, Setting) else None, setting, context)

    def write_secret(self, key: str, text: str, environment_id: int | None, context: Context) -> SecretSetting:
        secret = SecretSetting(environment_id=environment_id, creator_id=context.actor.id, key=key, value=text)
        existing = self.rows.row(SecretSetting, key, environment_id)
        self.reader.clear()
        return self.repository.merge(existing if isinstance(existing, SecretSetting) else None, secret, context)

    @staticmethod
    def environment(entry: SettingEntry, project: bool, environment_id: int | None) -> int | None:
        if project:
            if entry.scope == SettingScope.ENVIRONMENT.value:
                raise Refusal(f"{entry.key} is set per environment", "leave out --project and name --environment")
            return None
        if entry.scope == SettingScope.PROJECT.value:
            raise Refusal(f"{entry.key} is set for the whole project", "add --project")
        if environment_id is None:
            raise Refusal(f"{entry.key} needs an environment or the whole project", "name --environment, or add --project")
        return environment_id

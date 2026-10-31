import json

from core.base.command.context import Context
from core.base.repository.repository import Repository
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.models.setting import Setting
from core.modules.settings.support.setting_rows import SettingRows


class SettingStore:
    """The one writer of settings: a value for one environment, or for the whole project with no environment,
    written over its row or as a new row; a secret goes to the secret settings table as its text."""

    def __init__(self, rows: SettingRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def write(self, key: str, value: object, environment_id: int | None, context: Context) -> Setting:
        setting = Setting(environment_id=environment_id, creator_id=context.actor.id, key=key, value=json.dumps(value))
        existing = self.rows.row(Setting, key, environment_id)
        return self.repository.merge(existing if isinstance(existing, Setting) else None, setting, context)

    def write_secret(self, key: str, text: str, environment_id: int | None, context: Context) -> SecretSetting:
        secret = SecretSetting(environment_id=environment_id, creator_id=context.actor.id, key=key, value=text)
        existing = self.rows.row(SecretSetting, key, environment_id)
        return self.repository.merge(existing if isinstance(existing, SecretSetting) else None, secret, context)

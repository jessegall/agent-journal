from core.base.actor_type import ActorType
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.registry.setting_entry import SettingEntry
from core.base.repository.repository import Repository
from core.base.setting.setting_scope import SettingScope
from core.modules.settings.commands.set_setting import SetSetting
from core.modules.settings.commands.support.setting_store import SettingStore
from core.modules.settings.models.secret_setting import SecretSetting
from core.modules.settings.support.declared_settings import DeclaredSettings
from core.modules.settings.support.declared_values import DeclaredValues
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.setting_text import SettingText


class SetSettingHandler(Handler[SetSetting, CurrentSetting]):
    """Sets a declared setting where its scope allows, refusing an agent a setting only the user sets; a secret goes
    to its own table, which the event log keeps out."""

    command = SetSetting

    def __init__(self, declared: DeclaredSettings, values: DeclaredValues, store: SettingStore, queries: Queries, repository: Repository) -> None:
        self.declared, self.values, self.store, self.queries, self.repository = declared, values, store, queries, repository

    def handle(self, command: SetSetting, context: Context) -> CurrentSetting:
        entry = self.declared.value(command.key)
        if not entry.agent_writable and context.actor.type is not ActorType.USER:
            raise Refusal(f"ask the user to set {entry.key}", "only the user sets it, from the settings window or journal setting set")
        value = SettingText().value(entry, command.text)
        environment_id = self.environment(entry, command.project, context.environment_id)
        if entry.secret:
            self.keep_secret(entry.key, str(value), environment_id, context)
        else:
            self.store.write(entry.key, value, environment_id, context)
        return self.values.current(entry.key, context.environment_id)

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

    def keep_secret(self, key: str, value: str, environment_id: int | None, context: Context) -> None:
        query = self.queries.query(SecretSetting).filter(key=key)
        rows = (query.matching(IsNull("environment_id")) if environment_id is None else query.filter(environment_id=environment_id)).page(1, 1).rows
        secret = SecretSetting(environment_id=environment_id, creator_id=context.actor.id, key=key, value=value)
        self.repository.merge(rows[0] if rows else None, secret, context)

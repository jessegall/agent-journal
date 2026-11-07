from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_scope import SettingScope
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.settings.commands.support.setting_store import SettingStore
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.checked_setting_value import CheckedSettingValue


class SetSettingHandler(Handler[SetSetting, CurrentSetting]):
    """Sets a declared setting where its scope allows; a secret goes to its own table, which the event log keeps
    out."""

    command = SetSetting

    def __init__(self, declared: SettingCatalogue, values: SettingReader, store: SettingStore) -> None:
        self.declared, self.values, self.store = declared, values, store

    def handle(self, command: SetSetting, context: Context) -> CurrentSetting:
        entry = self.declared.value(command.key)
        value = CheckedSettingValue().value(entry, command.text)
        environment_id = self.environment(entry, command.project, context.environment_id)
        if entry.secret:
            self.store.write_secret(entry.key, str(value), environment_id, context)
        else:
            self.store.write(entry.key, value, environment_id, context)
        return self.values.current(entry.key)

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

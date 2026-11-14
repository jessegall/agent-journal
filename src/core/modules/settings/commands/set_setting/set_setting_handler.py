from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from core.modules.settings.commands.set_setting.set_setting import SetSetting
from core.modules.settings.support.setting_store import SettingStore
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from core.modules.settings.support.setting_reader import SettingReader
from core.modules.settings.support.setting_revision import SettingRevision
from core.modules.settings.support.current_setting import CurrentSetting
from core.modules.settings.support.checked_setting_value import CheckedSettingValue


class SetSettingHandler(Handler[SetSetting, CurrentSetting]):
    """Sets a declared setting where its scope allows; a secret goes to its own table, which the event log keeps
    out."""

    command = SetSetting

    def __init__(self, declared: SettingCatalogue, values: SettingReader, store: SettingStore, revision: SettingRevision) -> None:
        self.declared, self.values, self.store, self.revision = declared, values, store, revision

    def handle(self, command: SetSetting, context: Context) -> CurrentSetting:
        entry = self.declared.value(command.key)
        value = CheckedSettingValue().value(entry, command.text)
        if command.expected_revision and command.expected_revision != self.revision.current(entry.key):
            if self.values.current(entry.key).value == value:
                return self.values.current(entry.key)
            raise Refusal(f"{entry.key} changed since this change was asked for", "ask for the change again")
        environment_id = self.store.environment(entry, command.project, context.environment_id)
        if entry.secret:
            self.store.write_secret(entry.key, str(value), environment_id, context)
        else:
            self.store.write(entry.key, value, environment_id, context)
        return self.values.current(entry.key)

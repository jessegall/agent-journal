from collections.abc import Sequence

from engine.command.context import Context
from engine.registry.setting_entry import SettingEntry
from engine.enums.setting_scope import SettingScope
from core.modules.settings.support.setting_store import SettingStore
from core.modules.settings.support.checked_setting_value import CheckedSettingValue


class SettingChanges:
    """Writes several settings as one change: every value is checked against its declaration before the first is
    written, so one that fails leaves all of them as they were."""

    def __init__(self, store: SettingStore) -> None:
        self.store = store

    def apply(self, changes: Sequence[tuple[SettingEntry, str]], context: Context) -> None:
        checked = [(entry, CheckedSettingValue().value(entry, text)) for entry, text in changes]
        for entry, value in checked:
            self.store.write(entry.key, value, SettingStore.environment(entry, entry.scope == SettingScope.PROJECT.value, context.environment_id), context)

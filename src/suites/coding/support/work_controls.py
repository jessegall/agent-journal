import hashlib

from core.base.command.context import Context
from core.base.refusal import Refusal
from core.base.registry.setting_entry import SettingEntry
from core.base.setting.setting_scope import SettingScope
from core.modules.settings.commands.set_setting.set_setting_handler import SetSettingHandler
from core.modules.settings.commands.support.setting_store import SettingStore
from core.modules.settings.support.checked_setting_value import CheckedSettingValue
from core.modules.settings.support.setting_catalogue import SettingCatalogue
from suites.coding.support.coding_main_options import CONTROL_KEYS, CodingMainOptions
from suites.coding.support.main_options import PRESETS
from suites.coding.support.work_settings import WorkSettings


class WorkControls:
    """Reads the seven workflow controls and changes them together: every change is checked before any is written,
    and a change made from a reading that has since changed is refused, so a person never overwrites what they
    did not see."""

    def __init__(self, options: CodingMainOptions, declared: SettingCatalogue, store: SettingStore) -> None:
        self.options, self.declared, self.store = options, declared, store

    def shown(self) -> WorkSettings:
        current = self.options.options()
        controls = tuple(zip(CONTROL_KEYS.values(), current.bundle, strict=True))
        revision = hashlib.sha256(repr((controls, current.sources, current.problems)).encode()).hexdigest()[:12]
        return WorkSettings(current.workflow, revision, controls)

    def preset(self, name: str, revision: str, context: Context) -> WorkSettings:
        if name not in PRESETS:
            raise Refusal(f"{name} is not a preset", f"choose one of {', '.join(PRESETS)}")
        return self.apply(revision, tuple((key, "on" if value else "off") for key, value in zip(CONTROL_KEYS.values(), PRESETS[name], strict=True)), context)

    def apply(self, revision: str, changes: tuple[tuple[str, str], ...], context: Context) -> WorkSettings:
        if revision != self.shown().revision:
            raise Refusal("the work settings changed since you read them", "run journal work-settings show and apply again")
        checked = [(self.work_control(key), text) for key, text in changes]
        values = [(entry, CheckedSettingValue().value(entry, text)) for entry, text in checked]
        for entry, value in values:
            self.store.write(entry.key, value, SetSettingHandler.environment(entry, entry.scope == SettingScope.PROJECT.value, context.environment_id), context)
        return self.shown()

    def work_control(self, key: str) -> SettingEntry:
        if key not in CONTROL_KEYS.values():
            raise Refusal(f"{key} is not a work control", f"the work controls are {', '.join(CONTROL_KEYS.values())}")
        return self.declared.value(key)

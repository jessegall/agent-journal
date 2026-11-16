from core.modules.settings.bindings.reader_setting_source import ReaderSettingSource
from core.modules.settings.bindings.setting_guard_switches import SettingGuardSwitches
from core.modules.settings.support.undeclared_setting_notes import UndeclaredSettingNotes
from engine.guard.guard_switches import GuardSwitches
from engine.module.sync_notes import SyncNotes
from engine.setting.setting_source import SettingSource

SETTINGS_BINDINGS = {GuardSwitches: SettingGuardSwitches, SyncNotes: UndeclaredSettingNotes, SettingSource: ReaderSettingSource}

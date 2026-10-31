from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.settings"
GUARD_SETTINGS = f"{MODULE_KEY}.guard."
SETTINGS_SETTINGS = [SettingGroup("guard", "Guards and rules", "Guards and rules switched off for the whole project.",
                                  any_key=SettingValue("*", "On", "Whether this guard or rule is on.", SettingType.FLAG, default=True, scope=SettingScope.PROJECT))]

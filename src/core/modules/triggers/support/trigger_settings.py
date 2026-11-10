from engine.setting.setting_scope import SettingScope
from engine.setting.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.triggers"
AGENTS_ENABLE_SETTING = f"{MODULE_KEY}.agents-enable-triggers"
TRIGGER_SETTINGS = [
    SettingValue("agents-enable-triggers", "Auto-enable agent-created triggers", "A trigger an agent makes acts at once, without waiting for you to enable it.", SettingType.FLAG, default=False, scope=SettingScope.PROJECT, person_set=True),
]

from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.drivers"
SUITE_SETTING = f"{MODULE_KEY}.suite"
DAYS_SETTING = f"{MODULE_KEY}.hook-call-days"
DRIVER_SETTINGS = f"{MODULE_KEY}.driver."
ALLOWANCE_SETTINGS = f"{MODULE_KEY}.essential."
DRIVERS_SETTINGS = [
    SettingValue("suite", "Suite", "The suite of agents this environment works with.", SettingType.TEXT, default="", scope=SettingScope.ENVIRONMENT),
    SettingValue("hook-call-days", "Call record days", "How many days the journal keeps the record of each call from the agent program.", SettingType.NUMBER, default=30,
                 scope=SettingScope.PROJECT),
    SettingGroup("driver", "Drivers", "The driver each kind of agent works under in this environment.",
                 any_key=SettingValue("*", "Driver", "The driver this kind of agent works under.", SettingType.TEXT, default="", scope=SettingScope.ENVIRONMENT)),
    SettingGroup("essential", "Essential rules", "Essential rules the user allowed to be switched off.",
                 any_key=SettingValue("*", "Allowed", "Whether this essential rule may be switched off.", SettingType.FLAG, default=False, scope=SettingScope.PROJECT)),
]

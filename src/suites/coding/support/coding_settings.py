from core.base.driver.command_category import CommandCategory
from core.base.setting.setting_scope import SettingScope
from core.base.setting.ruled_settings import ruled_settings
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.base.setting.list_rule import ListRule


MODULE_KEY = "journal.suites.coding"
STARTS_HELPERS_SETTING = f"{MODULE_KEY}.main-starts-helpers"
AUTO_MODE_SETTING = f"{MODULE_KEY}.auto-mode"
WRITES_CODE_SETTING = f"{MODULE_KEY}.main-writes-code"
COMMAND_TYPES = f"{MODULE_KEY}.worker-command-types"
KEEP_RUNNING_SETTING = f"{MODULE_KEY}.continue-while-delegatable"
DESIGNER_ENABLED_SETTING = f"{MODULE_KEY}.designer-enabled"
CODING_SETTING_VALUES = [
    SettingValue("auto-mode", "Auto mode", "The journal hands the main agent its tasks, and it keeps going while tasks are left", SettingType.FLAG,
                 default=True, scope=SettingScope.ENVIRONMENT, person_set=True),
    SettingValue("main-writes-code", "Main agent writes code", "The main agent may change project files itself; off sends every change to a worker",
                 SettingType.FLAG, default=True, scope=SettingScope.ENVIRONMENT, person_set=True),
    SettingValue("main-starts-helpers", "Use ordinary helpers", "Whether the main agent may start ordinary helpers.",
                 SettingType.FLAG, default=True, scope=SettingScope.PROJECT, person_set=True),
    SettingValue("continue-while-delegatable", "Keep going while work can be delegated", "Keep the main agent working while open tasks can still be sent to workers.",
                 SettingType.FLAG, default=False, person_set=True),
    SettingValue("designer-enabled", "Use a designer", "Whether the main agent may start a designer, which writes a design document and changes no code.",
                 SettingType.FLAG, default=False, person_set=True),
    SettingValue("worker-command-types", "Worker command types", "The types of shell command a worker may run.", SettingType.LIST,
                 default=(CommandCategory.READ.value, CommandCategory.SEARCH.value, CommandCategory.EDIT.value, CommandCategory.CHECK.value, CommandCategory.TEST_RUN.value,
                          CommandCategory.BUILD.value), person_set=True),
]
CODING_SETTING_RULES = {COMMAND_TYPES: ListRule(choices=tuple(category.value for category in CommandCategory))}
CODING_SETTINGS = ruled_settings(MODULE_KEY, CODING_SETTING_VALUES, CODING_SETTING_RULES)

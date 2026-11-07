from core.base.driver.command_category import CommandCategory
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue


MODULE_KEY = "journal.suites.coding"
STARTS_HELPERS_SETTING = f"{MODULE_KEY}.builder-starts-helpers"
AUTO_MODE_SETTING = f"{MODULE_KEY}.auto-mode"
COMMAND_TYPES = f"{MODULE_KEY}.worker-command-types"
CODING_SETTINGS = [
    SettingValue("auto-mode", "Auto mode", "Assign the next open task when the builder finishes its current work.", SettingType.FLAG, default=True,
                 scope=SettingScope.ENVIRONMENT, person_set=True),
    SettingValue("builder-starts-helpers", "Builder starts helpers", "Whether the builder may start helpers.",
                 SettingType.FLAG, default=True, scope=SettingScope.PROJECT, person_set=True),
    SettingValue("worker-command-types", "Worker command types", "The types of shell command a worker may run.", SettingType.LIST,
                 default=(CommandCategory.READ.value, CommandCategory.SEARCH.value, CommandCategory.EDIT.value, CommandCategory.TEST_RUN.value,
                          CommandCategory.BUILD.value), person_set=True),
]

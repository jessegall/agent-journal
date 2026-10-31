from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.base.driver.command_category import CommandCategory

MODULE_KEY = "journal.suites.coding"
SENDS_SUBAGENTS_SETTING = f"{MODULE_KEY}.builder-sends-subagents"
COMMAND_TYPES = f"{MODULE_KEY}.worker-command-types"
CODING_SETTINGS = [
    SettingValue("builder-sends-subagents", "Builder sends subagents", "Whether the builder may send the agent program's own subagents.",
                 SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
    SettingValue("worker-command-types", "Worker command types", "The kinds of shell command a worker may run.", SettingType.LIST,
                 default=(CommandCategory.READ.value, CommandCategory.SEARCH.value, CommandCategory.EDIT.value, CommandCategory.TEST_RUN.value,
                          CommandCategory.BUILD.value)),
]

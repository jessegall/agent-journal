from engine.enums.command_category import CommandCategory
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.list_rule import ListRule
from engine.setting.setting_list import SettingList
from engine.setting.setting_value import SettingValue
from suites.coding.support.coding_settings import COMMAND_TYPES, MODULE_KEY


class CodingSettingValues(SettingList):
    """The settings of the coding suite: auto mode, what the main agent may do itself, the helpers it may use and the
    shell command types a worker may run."""

    module_key = MODULE_KEY
    values = [
        SettingValue("auto-mode", "Auto mode", "The journal hands the main agent its tasks, and it keeps going while tasks are left", SettingType.FLAG,
                     default=True, scope=SettingScope.ENVIRONMENT, person_set=True, screen="work", section="Taking on work"),
        SettingValue("main-writes-code", "Main agent writes code", "The main agent may change project files itself; off sends every change to a worker",
                     SettingType.FLAG, default=True, scope=SettingScope.ENVIRONMENT, person_set=True, screen="work", section="Taking on work"),
        SettingValue("main-starts-read-only-helpers", "Use read-only helpers", "Whether the main agent may start read-only helpers.",
                     SettingType.FLAG, default=True, scope=SettingScope.PROJECT, person_set=True, screen="work", section="Other helpers"),
        SettingValue("continue-while-delegatable", "Keep going while work can be delegated", "The main agent works on while open tasks are left: it sends them to free worker places, or takes one itself.",
                     SettingType.FLAG, default=False, person_set=True, screen="work", section="Workers"),
        SettingValue("designer-enabled", "Use a designer", "Whether the main agent may start a designer, which writes a design document and changes no code.",
                     SettingType.FLAG, default=False, person_set=True, screen="work", section="Other helpers"),
        SettingValue("plain-code-words", "Plain code words", "Every agent loads the skill on naming code in plain words at its start and after a compaction.",
                     SettingType.FLAG, default=True, scope=SettingScope.PROJECT, person_set=True, screen="work", section="Other helpers"),
        SettingValue("worker-command-types", "Worker command types", "Shell command types a worker may run; its command list judges journal lines, so journal here changes nothing.", SettingType.LIST,
                     default=(CommandCategory.READ.value, CommandCategory.SEARCH.value, CommandCategory.EDIT.value, CommandCategory.CHECK.value, CommandCategory.TEST_RUN.value,
                              CommandCategory.BUILD.value), person_set=True),
    ]
    rules = {COMMAND_TYPES: ListRule(choices=tuple(category.value for category in CommandCategory))}

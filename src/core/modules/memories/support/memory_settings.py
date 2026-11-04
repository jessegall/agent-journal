from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.memories"
KEYWORD_LIMIT = f"{MODULE_KEY}.keyword-limit"
MARKS_SETTING = f"{MODULE_KEY}.marks"
TYPE_SETTINGS = f"{MODULE_KEY}.type."
MEMORY_SETTINGS = [
    SettingValue("keyword-limit", "Memories per keyword", "Maximum memories recalled for each keyword.", SettingType.NUMBER, default=3),
    SettingValue("marks", "Context marks", "Context usage percentages at which the agent reviews memory priorities.", SettingType.NUMBER_LIST,
                 default=(50, 80, 90)),
    SettingGroup("type", "Memory types", "Enabled memory types. These choices override the suite defaults.",
                 any_key=SettingValue("*", "On", "Whether this memory type is on.", SettingType.FLAG)),
]

from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.memories"
KEYWORD_LIMIT = f"{MODULE_KEY}.keyword-limit"
MARKS_SETTING = f"{MODULE_KEY}.marks"
MARK_TOOL_USES_SETTING = f"{MODULE_KEY}.mark-tool-uses"
MEMORY_SETTINGS = [
    SettingValue("keyword-limit", "Memories per keyword", "Maximum memories recalled for each keyword.", SettingType.NUMBER, default=3),
    SettingValue("marks", "Context marks", "Context usage percentages at which the agent reviews memory priorities.", SettingType.NUMBER_LIST,
                 default=(50, 80, 90)),
    SettingValue("mark-tool-uses", "Tool uses at a context mark", "Tool uses the agent has at each context mark, in the same order, before it must review its memories.", SettingType.NUMBER_LIST,
                 default=(10, 5, 2)),
]

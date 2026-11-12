from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.claude_code"
MODEL_EFFORTS = f"{MODULE_KEY}.model-efforts"
DEFAULT_MODEL_EFFORTS = ("opus:medium", "sonnet:high")

CLAUDE_CODE_SETTINGS = [
    SettingValue("model-efforts", "Effort per Claude Code model", "Entries of model:effort, such as opus:medium or sonnet:high; a launch that names its effort keeps it.",
                 SettingType.LIST, default=DEFAULT_MODEL_EFFORTS, person_set=True),
]

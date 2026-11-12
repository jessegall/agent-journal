from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.codex"
MODEL_EFFORTS = f"{MODULE_KEY}.model-efforts"

CODEX_SETTINGS = [
    SettingValue("model-efforts", "Effort per Codex model", "Entries of model:effort, such as gpt-6.1-sol:high; a model not listed runs at Codex's own default.",
                 SettingType.LIST, default=(), person_set=True),
]

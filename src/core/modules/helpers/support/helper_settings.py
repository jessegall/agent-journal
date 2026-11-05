from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.helpers"
HELPER_LIMIT = f"{MODULE_KEY}.helper-limit"
ALLOWED_MODELS = f"{MODULE_KEY}.allowed-models"
HELPER_SETTINGS = [SettingValue("helper-limit", "Helper limit", "The most helpers that run at one time in an environment.", SettingType.NUMBER, default=4),
                   SettingValue("allowed-models", "Allowed models", "Models that agents may run, as program and model; empty allows all.", SettingType.LIST, default=())]

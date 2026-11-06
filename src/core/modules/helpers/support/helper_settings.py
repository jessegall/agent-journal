from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.helpers"
HELPER_LIMIT = f"{MODULE_KEY}.helper-limit"
ALLOWED_MODELS = f"{MODULE_KEY}.allowed-models"
HELPER_MAX_MINUTES = f"{MODULE_KEY}.helper-max-minutes"
HELPER_MAX_COST = f"{MODULE_KEY}.helper-max-cost"
HELPER_SETTINGS = [SettingValue("helper-limit", "Helper limit", "The most helpers that run at one time in an environment.", SettingType.NUMBER, default=4, person_set=True),
                   SettingValue("allowed-models", "Allowed models", "Models that agents may run, as program and model; empty allows all.", SettingType.LIST, default=(), person_set=True),
                   SettingValue("helper-max-minutes", "Longest helper job", "Minutes a helper may work on one job before it is stopped.", SettingType.NUMBER, default=60, person_set=True),
                   SettingValue("helper-max-cost", "Largest helper cost", "Dollars a helper may cost before it is stopped; 0 sets no limit.", SettingType.NUMBER, default=0, person_set=True)]

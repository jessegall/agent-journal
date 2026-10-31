from core.base.driver.essential_allowances import EssentialAllowances
from core.modules.settings.setting_values import SettingValues

ALLOWANCE_SETTINGS = "drivers.essential."


class SettingEssentialAllowances(EssentialAllowances):
    """Reads the user's allowance of an essential rule from the project setting drivers.essential.<rule>."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def allowed(self, rule: str) -> bool:
        return self.settings.project_value(f"{ALLOWANCE_SETTINGS}{rule}", False) is True

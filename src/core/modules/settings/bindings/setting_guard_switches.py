from core.base.guard.guard_switches import GuardSwitches
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.settings.support.settings_tree import GUARD_SETTINGS


class SettingGuardSwitches(GuardSwitches):
    """Reads whether a guard or rule is on from the project-wide setting of the settings module's guard group: false switches
    it off, any other value or none leaves it on, and a row for one environment is never read. The core
    never asks this of core.lifecycle."""

    def __init__(self, values: SettingValues) -> None:
        self.values = values

    def enabled(self, guard_name: str) -> bool:
        return self.values.project_value(f"{GUARD_SETTINGS}{guard_name}") is not False

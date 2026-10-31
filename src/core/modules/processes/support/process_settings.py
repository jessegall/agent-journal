from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.settings.bindings.support.setting_values import SettingValues


class ProcessSettings:
    """What the settings say about processes: a whole number of a setting of the module, or what the module
    defaults it to."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def integer(self, setting: ProcessSetting, environment_id: int) -> int:
        value = self.settings.value(setting.key, environment_id, setting.default)
        return value if isinstance(value, int) and not isinstance(value, bool) and value >= 0 else setting.default

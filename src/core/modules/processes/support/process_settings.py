from core.modules.processes.models.enums.process_setting import ProcessSetting
from core.modules.settings.bindings.support.setting_values import SettingValues


class ProcessSettings:
    """What the settings say about processes: a whole number of a setting of the module."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def integer(self, setting: ProcessSetting, environment_id: int) -> int:
        return self.settings.number(setting.key, environment_id)

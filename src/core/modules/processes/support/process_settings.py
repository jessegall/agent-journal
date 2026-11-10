from engine.driver.seconds import Seconds
from core.modules.processes.models.support.process_setting import ProcessSetting
from engine.setting.setting_values import SettingValues


class ProcessSettings:
    """What the settings say about processes: a whole number of a setting of the module."""

    def __init__(self, settings: SettingValues) -> None:
        self.settings = settings

    def integer(self, setting: ProcessSetting) -> int:
        return self.settings.number(setting.key)

    def seconds(self, setting: ProcessSetting) -> Seconds:
        return Seconds(self.integer(setting))

    def flag(self, setting: ProcessSetting) -> bool:
        return self.settings.flag(setting.key)

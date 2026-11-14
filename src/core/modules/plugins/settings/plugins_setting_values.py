from engine.setting.setting_list import SettingList
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue


class PluginsSettingValues(SettingList):
    """The settings of the plugins module."""

    values = [SettingValue("hold_window_ms", "Plugin answer limit", "The most milliseconds a plugin may take to answer an event it holds before the agent goes on.",
                           SettingType.NUMBER, default=50, scope=SettingScope.PROJECT),
              SettingValue("condition_limit_seconds", "Service condition limit", "The most seconds a plugin service's condition may take before it counts as failed.",
                           SettingType.NUMBER, default=10, scope=SettingScope.PROJECT)]

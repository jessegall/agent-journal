from engine.setting.setting_list import SettingList
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue


class TunnelSettingValues(SettingList):
    """The settings of the tunnel module."""

    values = [SettingValue("service", "Tunnel service", "Which installed tunnel a phone or a share link reaches this computer through.",
                           SettingType.TEXT, default="none", scope=SettingScope.PROJECT)]

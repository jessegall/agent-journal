from engine.setting.setting_list import SettingList
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue


class TunlerSettingValues(SettingList):
    """The settings of the tunler module."""

    values = [SettingValue("subdomain", "Subdomain", "The name in front of the tunler server's address that reaches this journal.",
                           SettingType.TEXT, default="", scope=SettingScope.PROJECT)]

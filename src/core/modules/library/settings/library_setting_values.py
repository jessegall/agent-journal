from engine.setting.setting_list import SettingList
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue


class LibrarySettingValues(SettingList):
    """The settings of the library module."""

    values = [SettingValue("address", "Shared server address", "The IP address or URL of your team's shared server, such as 10.0.0.5 or https://library.example.com.",
                           SettingType.TEXT, default="", scope=SettingScope.PROJECT),
              SettingValue("agent-edits-wait", "Agent edits wait for a user", "An agent's edit of an item that follows the library stays on this journal until a user sends it.",
                           SettingType.FLAG, default=True, scope=SettingScope.PROJECT)]

from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_list import SettingList
from engine.setting.setting_value import SettingValue
from suites.coding.support.graphify_settings import GRAPHIFY_SETTINGS


class GraphifySettingValues(SettingList):
    """The settings of Graphify: the commands that run and install it, beside the group that switches it on."""

    values = [
        SettingValue("graphify-command", "Graphify command", "The command that runs Graphify, with any arguments it needs first.",
                     SettingType.TEXT, default="graphify", scope=SettingScope.PROJECT, person_set=True),
        SettingValue("graphify-install-command", "Graphify install command", "The command the Tools page runs to install Graphify.",
                     SettingType.TEXT, default="uv tool install graphifyy", scope=SettingScope.PROJECT, person_set=True),
    ]
    groups = [GRAPHIFY_SETTINGS]

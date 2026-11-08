from enum import Enum

from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.tools"


class ToolSetting(Enum):
    """A setting of the tools module, declared once: its full key and its default come from its declaration."""

    GRAPHIFY_COMMAND = SettingValue("graphify-command", "Graphify command", "The command that runs Graphify, with any arguments it needs before its own.",
                                    SettingType.TEXT, default="graphify", scope=SettingScope.PROJECT)
    GRAPHIFY_INSTALL_COMMAND = SettingValue("graphify-install-command", "Graphify install command", "The command the Tools page runs to install Graphify.",
                                            SettingType.TEXT, default="uv tool install graphifyy", scope=SettingScope.PROJECT)

    @property
    def key(self) -> str:
        return f"{MODULE_KEY}.{self.value.key}"


TOOL_SETTINGS = [setting.value for setting in ToolSetting]

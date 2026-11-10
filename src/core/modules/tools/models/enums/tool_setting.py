from enum import Enum

from engine.setting.number_rule import NumberRule
from engine.setting.setting_group import SettingGroup
from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.tools"


class ToolSetting(Enum):
    """A setting of the tools module, declared once: its full key and its default come from its declaration."""

    GRAPHIFY_COMMAND = SettingValue("graphify-command", "Graphify command", "The command that runs Graphify, with any arguments it needs first.",
                                    SettingType.TEXT, default="graphify", scope=SettingScope.PROJECT)
    GRAPHIFY_INSTALL_COMMAND = SettingValue("graphify-install-command", "Graphify install command", "The command the Tools page runs to install Graphify.",
                                            SettingType.TEXT, default="uv tool install graphifyy", scope=SettingScope.PROJECT)

    @property
    def key(self) -> str:
        return f"{MODULE_KEY}.{self.value.key}"


TOOL_SETTINGS = [setting.value for setting in ToolSetting]

GRAPHIFY_GROUP = f"{MODULE_KEY}.graphify"

GRAPHIFY_SETTINGS = SettingGroup("graphify", "Graphify", "The settings of Graphify, switched on and off with the tool.", toggleable=True, enabled=False, children=[
    SettingValue("nudge-after", "Searches before a nudge", "At this many searches of the code without Graphify an agent is told to use it.",
                 SettingType.NUMBER, default=10, scope=SettingScope.PROJECT, rule=NumberRule(1), required_settings=[GRAPHIFY_GROUP]),
    SettingValue("block-after", "Searches before a block", "After this many searches of the code without Graphify, others are refused until the agent uses it.",
                 SettingType.NUMBER, default=25, scope=SettingScope.PROJECT, rule=NumberRule(1), required_settings=[GRAPHIFY_GROUP])])
GRAPHIFY_NUDGE_AFTER = f"{GRAPHIFY_GROUP}.nudge-after"
GRAPHIFY_BLOCK_AFTER = f"{GRAPHIFY_GROUP}.block-after"

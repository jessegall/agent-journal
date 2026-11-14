from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.number_rule import NumberRule
from engine.setting.setting_group import SettingGroup
from engine.setting.setting_value import SettingValue

from suites.coding.support.coding_settings import MODULE_KEY
GRAPHIFY_GROUP = f"{MODULE_KEY}.graphify"
GRAPHIFY_COMMAND = f"{MODULE_KEY}.graphify-command"
GRAPHIFY_INSTALL_COMMAND = f"{MODULE_KEY}.graphify-install-command"
GRAPHIFY_NUDGE_AFTER = f"{GRAPHIFY_GROUP}.nudge-after"
GRAPHIFY_BLOCK_AFTER = f"{GRAPHIFY_GROUP}.block-after"
GRAPHIFY_REFRESH_MINUTES = f"{GRAPHIFY_GROUP}.refresh-minutes"
GRAPHIFY_CLUSTER_MINUTES = f"{GRAPHIFY_GROUP}.cluster-minutes"

GRAPHIFY_SETTINGS = SettingGroup("graphify", "Graphify", "The settings of Graphify, switched on and off with the tool.", toggleable=True, enabled=False, children=[
    SettingValue("nudge-after", "Searches before a nudge", "At this many searches of the code without Graphify an agent is told to use it.",
                 SettingType.NUMBER, default=10, scope=SettingScope.PROJECT, rule=NumberRule(1), required_settings=[GRAPHIFY_GROUP]),
    SettingValue("block-after", "Searches before a block", "After this many searches of the code without Graphify, others are refused until the agent uses it.",
                 SettingType.NUMBER, default=25, scope=SettingScope.PROJECT, rule=NumberRule(1), required_settings=[GRAPHIFY_GROUP]),
    SettingValue("refresh-minutes", "Minutes between refreshes", "The graph is refreshed at most once in this many minutes, however many commits land.",
                 SettingType.NUMBER, default=10, scope=SettingScope.PROJECT, rule=NumberRule(1), required_settings=[GRAPHIFY_GROUP]),
    SettingValue("cluster-minutes", "Minutes between groupings", "The code is grouped into communities, the slow part of a refresh, at most once in this many minutes.",
                 SettingType.NUMBER, default=120, scope=SettingScope.PROJECT, rule=NumberRule(1), required_settings=[GRAPHIFY_GROUP])])
GRAPHIFY_SETTING_VALUES = [
    SettingValue("graphify-command", "Graphify command", "The command that runs Graphify, with any arguments it needs first.",
                 SettingType.TEXT, default="graphify", scope=SettingScope.PROJECT),
    SettingValue("graphify-install-command", "Graphify install command", "The command the Tools page runs to install Graphify.",
                 SettingType.TEXT, default="uv tool install graphifyy", scope=SettingScope.PROJECT),
    GRAPHIFY_SETTINGS]

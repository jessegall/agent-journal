from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.developer"
TOOLS_SETTING = f"{MODULE_KEY}.tools"
HOOKS_SETTING = f"{TOOLS_SETTING}.hooks"
HOOK_DURATIONS_SETTING = f"{HOOKS_SETTING}.terminal-durations"
HOOK_NUDGES_SETTING = f"{HOOKS_SETTING}.terminal-nudges"
DEVELOPER_SETTINGS = [
    SettingGroup("tools", "Developer tools", "Tools for working on the journal itself; switching this off turns off every one inside it.", toggleable=True, enabled=False,
                 children=[SettingGroup("hooks", "Agent tool calls", "Shows details of each agent tool call in the terminal.", toggleable=True,
                                        children=[SettingValue("terminal-durations", "Call times", "Shows how long each call took and what it cost.",
                                                               SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
                                                  SettingValue("terminal-nudges", "Nudges in the terminal", "Shows in the terminal every line the journal sends the agent.",
                                                               SettingType.FLAG, default=True, scope=SettingScope.PROJECT)])]),
]

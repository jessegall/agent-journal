from core.base.setting.setting_group import SettingGroup
from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue

MODULE_KEY = "journal.core.developer"
TOOLS_SETTING = f"{MODULE_KEY}.tools"
HOOKS_SETTING = f"{TOOLS_SETTING}.hooks"
HOOK_DURATIONS_SETTING = f"{HOOKS_SETTING}.terminal-durations"
HOOK_NUDGES_SETTING = f"{HOOKS_SETTING}.terminal-nudges"
HOOK_REQUEST_LOG_SETTING = f"{HOOKS_SETTING}.request-log"
HOOK_REQUEST_LOG_SIZE_SETTING = f"{HOOKS_SETTING}.request-log-size"
SLOW_TICKS_SETTING = f"{TOOLS_SETTING}.slow-clock-ticks"
DEVELOPER_SETTINGS = [
    SettingGroup("tools", "Developer tools", "Tools for working on the journal itself; switching this off turns off every one inside it.", toggleable=True, enabled=False,
                 children=[SettingGroup("hooks", "Agent tool calls", "Shows details of each agent tool call in the terminal.", toggleable=True,
                                        children=[SettingValue("terminal-durations", "Call times", "Shows how long each call took and what it cost.",
                                                               SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
                                                  SettingValue("terminal-nudges", "Nudges in the terminal", "Shows in the terminal every line the journal sends the agent.",
                                                               SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
                                                  SettingValue("request-log", "Record agent calls", "Keeps the last calls from agents as they were sent, with their headers and body, for a developer page.",
                                                               SettingType.FLAG, default=False, scope=SettingScope.PROJECT),
                                                  SettingValue("request-log-size", "Agent calls kept", "How many of the last calls the developer page keeps.",
                                                               SettingType.NUMBER, default=50, scope=SettingScope.PROJECT)]),
                           SettingValue("slow-clock-ticks", "Slow clock ticks", "Shows a chat message when one tick of the server clock takes over a quarter of a second.",
                                        SettingType.FLAG, default=True, scope=SettingScope.PROJECT)]),
]

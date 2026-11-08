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
EXCEPTION_LINES_SETTING = f"{TOOLS_SETTING}.exception-lines"
REPEATED_WORK_SETTING = f"{TOOLS_SETTING}.repeated-work"
PREVENT_LAZY_LOADING_SETTING = f"{TOOLS_SETTING}.prevent-lazy-loading"
PRIVATE_DATA_SETTING = f"{TOOLS_SETTING}.private-data"
DEVELOPER_SETTINGS = [
    SettingGroup("tools", "Developer tools", "Enable tools for developing the journal. Turning this off disables all developer tools.", toggleable=True, enabled=False,
                 children=[SettingGroup("hooks", "Agent tool calls", "Shows details of each agent tool call in the terminal.", toggleable=True,
                                        children=[SettingValue("terminal-durations", "Call costs", "Shows the database points each call cost.",
                                                               SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
                                                  SettingValue("terminal-nudges", "Nudges in the terminal", "Show all journal instructions in the agent’s terminal.",
                                                               SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
                                                  SettingValue("request-log", "Record agent calls", "Save recent agent requests, including headers and body, for the Request log.",
                                                               SettingType.FLAG, default=False, scope=SettingScope.PROJECT),
                                                  SettingValue("request-log-size", "Agent calls kept", "Number of recent requests to keep in the Request log.",
                                                               SettingType.NUMBER, default=50, scope=SettingScope.PROJECT)]),
                           SettingValue("mark-motion", "Record chat mark motion", "Records every animation frame of a chat mark as it opens and closes, for the agent to read.",
                                        SettingType.FLAG, default=False, scope=SettingScope.PROJECT),
                           SettingValue("exception-lines", "Errors to the agent", "Sends the main agent a line when an error shows in the chat.",
                                        SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
                           SettingValue("repeated-work", "Errors for repeated work", "Shows an error in the chat when a request or agent call repeats a query, queries per list item or repeats a file read.",
                                        SettingType.FLAG, default=False, scope=SettingScope.PROJECT),
                           SettingValue("prevent-lazy-loading", "Prevent lazy loading", "Stops with an error when the engine builds its registry or event lookup again instead of sharing the one loaded.",
                                        SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
                           SettingValue("private-data", "Scan for private data", "Looks through new or changed project files for private data and shows a card for each finding.",
                                        SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
                           SettingValue("slow-clock-ticks", "Costly clock ticks", "Shows a warning in the chat when one tick costs more than 50 database points; Errors to the agent sends it on.",
                                        SettingType.FLAG, default=True, scope=SettingScope.PROJECT)]),
]

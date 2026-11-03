from core.base.setting.setting_scope import SettingScope
from core.base.setting.setting_type import SettingType
from core.base.setting.setting_value import SettingValue
from core.modules.voices.support.builtin_catalogue import BuiltinCatalogue

MODULE_KEY = "journal.core.voices"
VOICE_SWITCH_KEY = f"{MODULE_KEY}.talk-in-voice"
PROFILE_KEY = f"{MODULE_KEY}.profile"
TITLE_KEY = f"{MODULE_KEY}.title"
NAME_KEY = f"{MODULE_KEY}.name"
AVATAR_KEY = f"{MODULE_KEY}.avatar"
AVATAR_SHOWN_KEY = f"{MODULE_KEY}.avatar-shown"
VOICE_KEYS = (PROFILE_KEY, TITLE_KEY, NAME_KEY)
AVATAR_SHOWN_CHOICES = ("always", "working", "never")

VOICES_SETTINGS = [
    SettingValue("talk-in-voice", "The agent talks in the voice", "Off, the voice only chooses the figure in the chat.", SettingType.FLAG, default=False, scope=SettingScope.PROJECT),
    SettingValue("profile", "Voice", "How the agent talks to you.", SettingType.CHOICE, default="butler", scope=SettingScope.PROJECT, choices=BuiltinCatalogue.NAMES),
    SettingValue("title", "Your title", "Sir, Madam, Captain: what the voice calls you before your name.", SettingType.TEXT, default="Sir", scope=SettingScope.PROJECT, agent_writable=True),
    SettingValue("name", "Your first name", "Empty takes the name git knows you by.", SettingType.TEXT, default="", scope=SettingScope.PROJECT, agent_writable=True),
    SettingValue("avatar", "Show a figure in the chat", "A small figure beside the chat shows what the agent is doing, in the voice it speaks.", SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
    SettingValue("avatar-shown","Show the figure", "Always, only while the agent works, or never.", SettingType.CHOICE, default="always", scope=SettingScope.PROJECT, choices=AVATAR_SHOWN_CHOICES),
]

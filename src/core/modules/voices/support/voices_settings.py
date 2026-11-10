from engine.enums.setting_scope import SettingScope
from engine.enums.setting_type import SettingType
from engine.setting.setting_value import SettingValue
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
    SettingValue("talk-in-voice", "The agent talks in the voice", "When off, the voice changes only the figure shown in the chat.", SettingType.FLAG, default=False, scope=SettingScope.PROJECT),
    SettingValue("profile", "Voice", "How the agent talks to you.", SettingType.CHOICE, default="butler", scope=SettingScope.PROJECT, choices=BuiltinCatalogue.NAMES),
    SettingValue("title", "Your title", "Sir, Madam, Captain: what the voice calls you before your name.", SettingType.TEXT, default="Sir", scope=SettingScope.PROJECT),
    SettingValue("name", "Your first name", "Leave blank to use your Git name.", SettingType.TEXT, default="", scope=SettingScope.PROJECT),
    SettingValue("avatar", "Show a figure in the chat", "A small figure beside the chat shows what the agent is doing, in the voice it speaks.", SettingType.FLAG, default=True, scope=SettingScope.PROJECT),
    SettingValue("avatar-shown","Show the figure", "Always, only while the agent works, or never.", SettingType.CHOICE, default="always", scope=SettingScope.PROJECT, choices=AVATAR_SHOWN_CHOICES),
]

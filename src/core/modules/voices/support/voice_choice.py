
from engine.setting.setting_values import SettingValues
from core.modules.voices.support.builtin_catalogue import BuiltinCatalogue
from core.modules.voices.support.voice import Voice
from core.modules.voices.support.voices_settings import AVATAR_KEY, AVATAR_SHOWN_KEY, NAME_KEY, PROFILE_KEY, TITLE_KEY, VOICE_SWITCH_KEY


class VoiceChoice:
    """The voice, title and first name the user chose, as settings of the project; with no name chosen, the first
    name is the one git knew the user by when the journal started."""

    def __init__(self, values: SettingValues) -> None:
        self.values = values

    def is_voiced(self) -> bool:
        return self.values.project.flag(VOICE_SWITCH_KEY)

    def voice(self) -> Voice:
        return BuiltinCatalogue.lookup(self.values.project.text(PROFILE_KEY))

    def title(self) -> str:
        return self.values.project.text(TITLE_KEY)

    def first_name(self) -> str:
        return self.values.project.text(NAME_KEY)

    def instruction(self) -> str:
        return self.voice().instruction(self.title(), self.first_name())

    def called(self) -> str:
        return self.voice().called(self.title(), self.first_name())

    def avatar(self) -> bool:
        return self.values.project.flag(AVATAR_KEY)

    def avatar_shown(self) -> str:
        return self.values.project.text(AVATAR_SHOWN_KEY)

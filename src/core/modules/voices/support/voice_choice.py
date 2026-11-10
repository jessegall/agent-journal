import subprocess

from engine.journal.journal_home import JournalHome
from core.modules.settings.bindings.support.setting_values import SettingValues
from core.modules.voices.support.builtin_catalogue import BuiltinCatalogue
from core.modules.voices.support.voice import Voice
from core.modules.voices.support.voices_settings import AVATAR_KEY, AVATAR_SHOWN_KEY, NAME_KEY, PROFILE_KEY, TITLE_KEY, VOICE_SWITCH_KEY

GIT_SECONDS = 5


class VoiceChoice:
    """The voice, title and first name the user chose, as settings of the project; the first name falls back to
    what git knows the user by."""

    def __init__(self, values: SettingValues, home: JournalHome) -> None:
        self.values, self.home = values, home

    def is_voiced(self) -> bool:
        return self.values.project.flag(VOICE_SWITCH_KEY)

    def voice(self) -> Voice:
        return BuiltinCatalogue.lookup(self.values.project.text(PROFILE_KEY))

    def title(self) -> str:
        return self.values.project.text(TITLE_KEY)

    def first_name(self) -> str:
        return self.values.project.text(NAME_KEY) or self.git_first_name()

    def instruction(self) -> str:
        return self.voice().instruction(self.title(), self.first_name())

    def called(self) -> str:
        return self.voice().called(self.title(), self.first_name())

    def avatar(self) -> bool:
        return self.values.project.flag(AVATAR_KEY)

    def avatar_shown(self) -> str:
        return self.values.project.text(AVATAR_SHOWN_KEY)

    def git_first_name(self) -> str:
        try:
            full = subprocess.run(["git", "config", "user.name"], cwd=self.home.project_folder, capture_output=True, text=True, timeout=GIT_SECONDS).stdout.strip()
        except (OSError, subprocess.TimeoutExpired):
            return ""
        return full.split(" ")[0] if full else ""

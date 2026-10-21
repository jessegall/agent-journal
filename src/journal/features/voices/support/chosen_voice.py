import subprocess
import time

from journal.config import Config
from journal.support.shipped import Shipped
from journal.features.voices.support.voice import Voice
from journal.repositories.setting_rows import SettingRows


FRESH_SECONDS = 60.0


class ChosenVoice:
    """The voice, title and first name the user chose, as settings on the project; the first name falls back to what git knows the user by."""

    def __init__(self, settings: SettingRows, config: Config) -> None:
        self.settings, self.config = settings, config
        self.git_name_read_at = 0.0
        self.last_git_name = ""

    def voice(self) -> Voice:
        from journal.features.voices.feature import Voices
        return Shipped.named(str(self.settings.option(Voices.PROFILE)))

    def title(self) -> str:
        from journal.features.voices.feature import Voices
        return str(self.settings.option(Voices.TITLE))

    def first_name(self) -> str:
        from journal.features.voices.feature import Voices
        return str(self.settings.option(Voices.NAME) or self.git_name())

    def instruction(self) -> str:
        return self.voice().instruction(self.title(), self.first_name())

    def git_name(self) -> str:
        if time.monotonic() - self.git_name_read_at < FRESH_SECONDS:
            return self.last_git_name
        self.last_git_name, self.git_name_read_at = self.git_user_first_name(), time.monotonic()
        return self.last_git_name

    def git_user_first_name(self) -> str:
        try:
            full = subprocess.run(["git", "config", "user.name"], cwd=self.config.root, capture_output=True, text=True, timeout=5).stdout.strip()
        except (OSError, subprocess.TimeoutExpired):
            return ""
        return full.split(" ")[0] if full else ""

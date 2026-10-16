import subprocess

from journal.config import Config
from journal.features.voices.shipped import Shipped
from journal.features.voices.voice import Voice
from journal.repositories.settings import Settings


class ChosenVoice:
    """The voice, title and first name the user chose, as settings on the project; the first name falls back to what git knows the user by."""

    def __init__(self, settings: Settings, config: Config) -> None:
        self.settings, self.config = settings, config

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
        try:
            full = subprocess.run(["git", "config", "user.name"], cwd=self.config.root, capture_output=True, text=True, timeout=5).stdout.strip()
        except (OSError, subprocess.TimeoutExpired):
            return ""
        return full.split(" ")[0] if full else ""

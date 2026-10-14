import subprocess

from journal.config import Config
from journal.features.voices.shipped import Shipped
from journal.features.voices.voice import Voice
from journal.repositories.settings import PROJECT, Settings


class ChosenVoice:
    """The voice, title and first name the user chose, as settings on the project; the first name falls back to what git knows the user by."""

    VOICE, TITLE, NAME = "voice.profile", "voice.title", "voice.name"

    def __init__(self, settings: Settings, config: Config) -> None:
        self.settings, self.config = settings, config

    def voice(self) -> Voice:
        return Shipped.named(str(self.settings.get(PROJECT, self.VOICE, "butler")))

    def title(self) -> str:
        return str(self.settings.get(PROJECT, self.TITLE, "Sir"))

    def first_name(self) -> str:
        return str(self.settings.get(PROJECT, self.NAME, "") or self.git_name())

    def instruction(self) -> str:
        return self.voice().instruction(self.title(), self.first_name())

    def git_name(self) -> str:
        try:
            full = subprocess.run(["git", "config", "user.name"], cwd=self.config.root, capture_output=True, text=True, timeout=5).stdout.strip()
        except (OSError, subprocess.TimeoutExpired):
            return ""
        return full.split(" ")[0] if full else ""

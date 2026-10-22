from dataclasses import dataclass

from journal.models.model import Model


@dataclass(frozen=True)
class ReleaseMessage(Model):
    """What a release tells the project's agent once after the journal was updated to it: the version, the words, and whether an agent has read it. Project-wide."""

    version: str = ""
    text: str = ""
    is_read: bool = False

    def opened(self) -> "ReleaseMessage":
        return self.with_(is_read=True)

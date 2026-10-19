from typing import ClassVar
from dataclasses import dataclass
from datetime import datetime

from journal.models.scoped import Scoped


@dataclass(frozen=True)
class Notice(Scoped):
    """A pin above the chat: a link the agent gave the user, with what it is and the words on its button, kept until the user closes it."""

    text_fields: ClassVar[tuple[str, ...]] = ("title",)
    title: str = ""
    link: str = ""
    label: str = ""
    tone: str = "note"
    closed_at: datetime | None = None

    def closed(self, at: datetime) -> "Notice":
        return self.with_(closed_at=at)

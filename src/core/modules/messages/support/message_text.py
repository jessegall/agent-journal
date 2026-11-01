from dataclasses import dataclass

from core.base.cli.row_links import RowLinks
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class MessageText:
    """What reading a message shows: its words and the lines naming what it links to."""

    id: int
    text: str
    links: tuple[str, ...]

    @classmethod
    def of(cls, message: Message, links: RowLinks) -> "MessageText":
        return cls(message.id, message.text, tuple(links.lines(Message.model_name, message.id)))

    def lines(self) -> tuple[str, ...]:
        return (self.text, *self.links)

    def json(self) -> dict[str, object]:
        return {"id": self.id, "text": self.text, "links": list(self.links)}

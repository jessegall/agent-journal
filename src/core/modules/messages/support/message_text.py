from dataclasses import dataclass

from core.base.cli.row_links import RowLinks
from engine.types.type_guards import is_mapping
from core.modules.messages.support.messages_module_name import MESSAGES_MODULE
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class MessageText:
    """What reading a message shows: its words, what it replies on or comments on, and what it links to."""

    id: int
    text: str
    origins: tuple[str, ...]
    links: tuple[str, ...]

    @classmethod
    def built(cls, message: Message, links: RowLinks) -> "MessageText":
        comment = message.metadata.module_part(MESSAGES_MODULE).get("commented_row")
        commented_row = f"{comment['model']}:{comment['id']}" if is_mapping(comment) else None
        reply_lines = [f"reply on: message:{message.parent_id}"] if message.parent_id is not None else []
        comment_lines = [f"comment on: {commented_row}"] if commented_row else []
        exceptions = tuple(filter(None, [commented_row]))
        return cls(message.id, message.text, tuple(reply_lines + comment_lines), tuple(links.lines(Message.model_name, message.id, exceptions)))

    def lines(self) -> tuple[str, ...]:
        return (self.text, *self.origins, *self.links)

    def json(self) -> dict[str, object]:
        return {"id": self.id, "text": self.text, "origins": list(self.origins), "links": list(self.links)}

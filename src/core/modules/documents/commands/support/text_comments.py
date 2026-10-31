from dataclasses import dataclass

from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class TextComments:
    """The comments on one document or report: the messages linked to it as comments_on."""

    cli_name: str
    row_id: int
    messages: tuple[Message, ...]

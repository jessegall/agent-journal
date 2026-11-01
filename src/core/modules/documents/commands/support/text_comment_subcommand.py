from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.comment_on_text.comment_on_text import CommentOnText
from core.modules.documents.models.text_row import TextRow
from core.modules.messages.models.message import Message


class TextCommentSubcommand(Subcommand[CommentOnText, Message]):
    """`journal <doc or report> comment <n> <text>`: a comment on it, sent to the chat and linked to it."""

    model: ClassVar[type[TextRow]]
    name = "comment"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("text")

    def command(self, arguments: Namespace, caller: Caller) -> CommentOnText:
        return CommentOnText(self.model, arguments.id, arguments.text)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, Message):
            output.line(f"comment written as message {value.id}")

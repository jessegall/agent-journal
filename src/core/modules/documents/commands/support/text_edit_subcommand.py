from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.edit_text import EditText
from core.modules.documents.commands.support.text_body import TextBody
from core.modules.documents.models.text_row import TextRow


class TextEditSubcommand(Subcommand[EditText, TextRow]):
    """`journal <doc or report> edit <n> [--abstract "<one line>"] [--body "<text>" | --file <path>]`."""

    model: ClassVar[type[TextRow]]
    name = "edit"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("--abstract")
        parser.add_argument("--body")
        parser.add_argument("--file")

    def command(self, arguments: Namespace, caller: Caller) -> EditText:
        return EditText(self.model, arguments.id, arguments.abstract, TextBody.given(arguments))


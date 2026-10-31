from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.edit_text import EditText
from core.modules.documents.commands.support.text_body import TextBody
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report


class TextEditSubcommand(Subcommand[EditText, Doc | Report]):
    """`journal <doc or report> edit <n> [--abstract "<one line>"] [--body "<text>" | --file <path>]`."""

    model: ClassVar[type[Doc] | type[Report]]
    name = "edit"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("--abstract")
        parser.add_argument("--body")
        parser.add_argument("--file")

    def command(self, arguments: Namespace, caller: Caller) -> EditText:
        return EditText(self.model, arguments.id, arguments.abstract, TextBody.given(arguments))


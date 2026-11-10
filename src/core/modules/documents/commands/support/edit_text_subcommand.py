from argparse import ArgumentParser, Namespace
from typing import ClassVar

from engine.caller.caller import Caller
from engine.errors.refusal import Refusal
from engine.subcommand.subcommand import Subcommand
from core.modules.documents.commands.edit_text.edit_text import EditText
from core.modules.documents.commands.support.text_body import TextBody
from core.modules.documents.models.text_row import TextRow
from core.modules.documents.support.text_change import TextChange


class EditTextSubcommand(Subcommand[EditText, TextRow]):
    """`journal <doc or report> edit <n> [--abstract "<one line>"] [--section <n or heading>]
    [--body "<text>" | --file <path>]`, or `--replace "<old>" --with "<new>"` for one exact piece of the text."""

    model: ClassVar[type[TextRow]]
    name = "edit"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        parser.add_argument("--abstract")
        parser.add_argument("--body")
        parser.add_argument("--file")
        parser.add_argument("--section")
        parser.add_argument("--replace")
        parser.add_argument("--with", dest="new_text")

    def command(self, arguments: Namespace, caller: Caller) -> EditText:
        return EditText(self.model, arguments.id, arguments.abstract, self.change(arguments))

    @staticmethod
    def change(arguments: Namespace) -> TextChange:
        body = TextBody.given(arguments)
        if arguments.section is not None and body is None:
            raise Refusal("--section needs the section's new text", "give it with --body or --file")
        if arguments.replace is None and arguments.new_text is not None:
            raise Refusal("--with needs --replace", 'give the old text with --replace "<old>"')
        if arguments.replace is None:
            return TextChange(body, arguments.section)
        if arguments.new_text is None or body is not None or arguments.section is not None:
            raise Refusal("--replace goes with --with alone", 'give --replace "<old>" --with "<new>", without --body, --file or --section')
        return TextChange(old_text=arguments.replace, new_text=arguments.new_text)


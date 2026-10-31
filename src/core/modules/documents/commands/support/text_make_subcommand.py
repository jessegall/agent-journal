from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.refusal import Refusal
from core.base.subcommand.output import Output
from core.base.subcommand.subcommand import Subcommand
from core.modules.documents.commands.make_text import MakeText
from core.modules.documents.commands.support.new_text import NewText
from core.modules.documents.commands.support.text_body import TextBody
from core.modules.documents.models.text_row import TextRow


class TextMakeSubcommand(Subcommand[MakeText, NewText]):
    """`journal <doc or report> make <title> --abstract "<one line>" --body "<text>" | --file <path>`."""

    model: ClassVar[type[TextRow]]
    name = "make"

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("title")
        parser.add_argument("--abstract", default="")
        parser.add_argument("--body")
        parser.add_argument("--file")
        parser.add_argument("--about", nargs="*", default=[])

    def command(self, arguments: Namespace, caller: Caller) -> MakeText:
        body = TextBody.given(arguments)
        if body is None:
            raise Refusal(f"a {self.model.cli_name} needs its text", 'give it with --body "<text>" or --file <path>')
        return MakeText(self.model, arguments.title, arguments.abstract, body, tuple(arguments.about))

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, NewText):
            subjects = f", about {', '.join(value.subjects)}" if value.subjects else ""
            output.line(f"{value.text_row.cli_name} {value.text_row.id}: {value.text_row.title}{subjects}")

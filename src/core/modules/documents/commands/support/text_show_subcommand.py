from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.commands.support.text_reading import TextReading
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.report import Report
from core.modules.documents.support.text_lines import TextLines


class TextShowSubcommand(ReadSubcommand[TextReading]):
    """`journal <doc or report> show <n>`: its outline, or one section, its bullets, a search or the whole text."""

    model: ClassVar[type[Doc] | type[Report]]
    name = "show"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)
        TextLines.reading_flags(parser)

    def read(self, arguments: Namespace, caller: Caller) -> TextReading:
        return TextReading(self.queries.query(self.model).find(arguments.id), arguments)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, TextReading):
            return
        if output.json_output:
            output.row(value.text_row)
            return
        text_row = value.text_row
        TextLines.write(f"{text_row.cli_name} {text_row.id}: {text_row.title}", text_row.abstract, text_row.body, value.arguments, output)

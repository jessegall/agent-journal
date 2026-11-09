from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.cli.row_links import LINKS_SHOWN, RowLinks
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.base.library.library_reading import LibraryReading
from core.modules.documents.commands.support.text_reading import TextReading
from core.modules.documents.models.text_row import TextRow
from core.modules.documents.support.text_lines import TextLines


OUTLINE_LINKS_SHOWN = 10


class TextShowSubcommand(ReadSubcommand[TextReading | LibraryReading]):
    """`journal <doc or report> show <n>`: its outline, or one section, its bullets, a search or the whole
    text."""

    model: ClassVar[type[TextRow]]
    id_type: ClassVar[staticmethod[[str], object]] = staticmethod(int)
    name = "show"

    def __init__(self, queries: Queries, links: RowLinks) -> None:
        self.queries, self.links = queries, links

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=self.id_type)
        TextLines.reading_flags(parser)

    def read(self, arguments: Namespace, caller: Caller) -> TextReading | LibraryReading:
        return self.reading(arguments)

    def reading(self, arguments: Namespace) -> TextReading:
        return TextReading(self.queries.query(self.model).find(arguments.id), arguments)

    def write_output(self, value: object, output: Output) -> None:
        if not isinstance(value, TextReading):
            return
        if output.json_output:
            output.row(value.text_row)
            return
        text_row = value.text_row
        TextLines.write(f"{text_row.cli_name} {text_row.id}: {text_row.title}", text_row.abstract, text_row.body, value.arguments, output)
        for line in self.link_lines(text_row, value.arguments):
            output.line(line)

    def link_lines(self, text_row: TextRow, arguments: Namespace) -> list[str]:
        if TextLines.is_part_read(arguments):
            return []
        return self.links.lines(text_row.model_name, text_row.id, limit=LINKS_SHOWN if arguments.all else OUTLINE_LINKS_SHOWN)

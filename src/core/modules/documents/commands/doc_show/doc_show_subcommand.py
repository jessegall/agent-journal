from argparse import Namespace

from core.base.caller.caller import Caller
from core.base.cli.row_links import RowLinks
from core.base.library.library_lookup import LibraryLookup
from core.base.library.library_aware_show import LibraryAwareShow
from core.base.library.library_ref import LibraryRef
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.library.library_reading import LibraryReading
from core.modules.documents.commands.support.text_reading import TextReading
from core.modules.documents.commands.support.text_show_subcommand import TextShowSubcommand
from core.modules.documents.models.doc import Doc
from core.modules.documents.support.text_lines import TextLines


class DocShowSubcommand(LibraryAwareShow, TextShowSubcommand):
    """`journal doc show <n or library:n>`: a document of this journal, or one of the team's library read live."""

    id_type = staticmethod(LibraryRef.row_id)
    model = Doc
    share = "doc"
    cli_name = "doc"

    def __init__(self, queries: Queries, links: RowLinks, lookup: LibraryLookup) -> None:
        super().__init__(queries, links)
        self.lookup = lookup

    def local(self, arguments: Namespace, caller: Caller) -> TextReading:
        return TextShowSubcommand.read(self, arguments, caller)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, LibraryReading):
            self.write_library(value, output)
            return
        super().write_output(value, output)

    @staticmethod
    def write_library(fetched: LibraryReading, output: Output) -> None:
        item = fetched.item
        if output.json_output:
            output.write("", item.json())
            return
        output.line(f"From the team's library, version {item.version}, changed by {item.author}; it is not a document of this journal.")
        TextLines.write(f"library doc {item.item_id}: {item.fields.get('title', '')}", str(item.fields.get("abstract", "")), str(item.fields.get("body", "")), fetched.arguments, output)

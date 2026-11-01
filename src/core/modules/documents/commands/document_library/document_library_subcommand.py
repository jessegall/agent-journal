from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from core.base.query.conditions.greater import Greater
from core.base.query.queries import Queries
from core.base.query.query import PAGE_SIZE_ROWS
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.models.document_row import DocumentRow
from core.modules.documents.support.document_library import DocumentLibrary

KINDS = ("doc", "report")
OPEN = "open"
CLOSED = "closed"


class DocumentLibrarySubcommand(ReadSubcommand[DocumentLibrary]):
    """`journal document library [--kind doc|report] [--state open|closed] [--after <id>]`: a page of documents or reports with no text, oldest first, after the number given."""

    cli_name = "document"
    name = "library"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--kind", choices=KINDS, default="doc")
        parser.add_argument("--state", choices=(OPEN, CLOSED))
        parser.add_argument("--after", type=int, default=0)

    def read(self, arguments: Namespace, caller: Caller) -> DocumentLibrary:
        kind = self.queries.query(DocumentRow).filter(kind=arguments.kind)
        if arguments.state == OPEN:
            kind = kind.filter(close_reason="")
        if arguments.state == CLOSED:
            kind = kind.matching(Greater("close_reason", ""))
        rows = kind.matching(Greater("id", arguments.after)).ordered("id").page(1, PAGE_SIZE_ROWS).rows
        return DocumentLibrary(kind.count(), rows)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DocumentLibrary):
            output.write(f"{value.total} in all", value.json())

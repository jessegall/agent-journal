from argparse import ArgumentParser, Namespace

from core.base.caller.caller import Caller
from engine.query.conditions.greater import Greater
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.query.query import PAGE_SIZE_ROWS
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.models.document_row import DocumentRow
from core.modules.documents.support.document_library import DocumentLibrary

CATEGORIES = ("doc", "report")
OPEN = "open"
CLOSED = "closed"


class DocumentLibrarySubcommand(ReadSubcommand[DocumentLibrary]):
    """`journal document library [--type doc|report] [--state open|closed] [--before <id>]`: a page of
    documents or reports with no text, newest first, before the number given."""

    cli_name = "document"
    name = "library"

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("--type", choices=CATEGORIES, default="doc")
        parser.add_argument("--state", choices=(OPEN, CLOSED))
        parser.add_argument("--before", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> DocumentLibrary:
        category = self.queries.query(DocumentRow).filter(row_type=arguments.type)
        if arguments.state == OPEN:
            category = category.filter(close_reason="")
        if arguments.state == CLOSED:
            category = category.matching(Greater("close_reason", ""))
        page = category if arguments.before is None else category.matching(Less("id", arguments.before))
        rows = tuple(page.newest().limited(PAGE_SIZE_ROWS))
        return DocumentLibrary(category.count(), rows)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, DocumentLibrary):
            output.write(f"{value.total} in all", value.json())

from argparse import ArgumentParser, Namespace
from typing import ClassVar

from core.base.caller.caller import Caller
from core.base.query.queries import Queries
from core.base.subcommand.output import Output
from core.base.subcommand.read_subcommand import ReadSubcommand
from core.modules.documents.support.row_comments import RowComments
from core.modules.documents.commands.support.text_inspection import TextInspection
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.open_document import OpenDocument
from core.modules.documents.models.text_row import TextRow
from core.modules.documents.support.doc_revisions import DocRevisions


class TextInspectSubcommand(ReadSubcommand[TextInspection]):
    """`journal <doc or report> inspect <n>`: its row with its comments and its latest revision, in one read.
    A share link does not list this read, as a shared text does not show its comments."""

    model: ClassVar[type[TextRow]]
    name = "inspect"

    def __init__(self, queries: Queries, comments: RowComments, revisions: DocRevisions) -> None:
        self.queries, self.comments, self.revisions = queries, comments, revisions

    def arguments(self, parser: ArgumentParser) -> None:
        parser.add_argument("id", type=int)

    def read(self, arguments: Namespace, caller: Caller) -> TextInspection:
        text_row = self.queries.query(self.model).find(arguments.id)
        latest = self.revisions.latest(text_row.id) if isinstance(text_row, Doc) else None
        opened = self.queries.query(OpenDocument).filter(doc_id=text_row.id).first() if isinstance(text_row, Doc) else None
        return TextInspection(text_row, self.comments.reads(text_row), latest.number if latest else None, opened.author_id if opened else None)

    def write_output(self, value: object, output: Output) -> None:
        if isinstance(value, TextInspection):
            output.write(value.text_row.title, {**output.values(value.text_row), "comments": [output.values(comment) for comment in value.comments], "revision": value.revision, "open_author_id": value.open_author_id})

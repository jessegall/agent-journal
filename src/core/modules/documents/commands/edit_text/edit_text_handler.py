from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.commands.edit_text.edit_text import EditText
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.text_row import TextRow
from core.modules.documents.support.doc_revisions import DocRevisions
from core.modules.documents.support.markdown_check import MarkdownCheck


class EditTextHandler(Handler[EditText, TextRow]):
    """Changes a document's or report's text, keeping what was not given, and records a document's revision."""

    command = EditText

    def __init__(self, queries: Queries, repository: Repository, revisions: DocRevisions) -> None:
        self.queries, self.repository, self.revisions = queries, repository, revisions

    def handle(self, command: EditText, context: Context) -> TextRow:
        text_row = self.queries.query(command.text_model).find(command.row_id)
        if isinstance(text_row, Doc):
            self.revisions.require_open(text_row, context)
        body = command.change.applied(text_row.body)
        if command.change.changes_body():
            MarkdownCheck.check(body)
        edited = self.repository.update(text_row, context, abstract=text_row.abstract if command.abstract is None else command.abstract, body=body)
        if isinstance(edited, Doc):
            self.revisions.record(edited, context)
        return edited

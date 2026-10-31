from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.documents.commands.edit_text import EditText
from core.modules.documents.models.doc import Doc
from core.modules.documents.models.text_row import TextRow
from core.modules.documents.support.doc_revisions import DocRevisions


class EditTextHandler(Handler[EditText, TextRow]):
    """Writes a document's or report's text anew, keeping what was not given, and records a document's revision."""

    command = EditText

    def __init__(self, queries: Queries, repository: Repository, revisions: DocRevisions) -> None:
        self.queries, self.repository, self.revisions = queries, repository, revisions

    def handle(self, command: EditText, context: Context) -> TextRow:
        text_row = self.queries.query(command.text_model).find(command.row_id)
        edited = self.repository.save(text_row.changed(abstract=text_row.abstract if command.abstract is None else command.abstract,
                                                      body=text_row.body if command.body is None else command.body), context)
        if isinstance(edited, Doc):
            self.revisions.record(edited, context)
        return edited

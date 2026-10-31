from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.documents.commands.close_text import CloseText
from core.modules.documents.models.text_row import TextRow


class CloseTextHandler(Handler[CloseText, TextRow]):
    """Closes a document or report, only with the reason it needs no action."""

    command = CloseText

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: CloseText, context: Context) -> TextRow:
        if not command.reason.strip():
            raise Refusal(f'{command.text_model.cli_name} {command.row_id} is closed only with the reason it needs no action: --why "<why>"', "say why it needs no action")
        text_row = self.queries.query(command.text_model).find(command.row_id)
        return self.repository.save(text_row.changed(close_reason=command.reason.strip()), context)

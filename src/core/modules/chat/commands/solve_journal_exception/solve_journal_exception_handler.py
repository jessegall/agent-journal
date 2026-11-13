from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.repository.repository import Repository
from core.modules.chat.commands.solve_journal_exception.solve_journal_exception import SolveJournalException
from core.modules.chat.models.journal_exception import JournalException


class SolveJournalExceptionHandler(Handler[SolveJournalException, JournalException]):
    """Takes a recorded exception out of the errors a user reads; the error log file keeps its trace."""

    command = SolveJournalException

    def __init__(self, rows: EventRows, repository: Repository) -> None:
        self.rows, self.repository = rows, repository

    def handle(self, command: SolveJournalException, context: Context) -> JournalException:
        exception = self.rows.required(JournalException, command.row_id)
        self.repository.delete(exception, context)
        return exception

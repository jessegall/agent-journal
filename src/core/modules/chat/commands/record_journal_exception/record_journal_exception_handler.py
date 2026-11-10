from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.chat.commands.record_journal_exception.record_journal_exception import RecordJournalException
from core.modules.chat.models.journal_exception import JournalException


class RecordJournalExceptionHandler(Handler[RecordJournalException, JournalException]):
    """Saves the exception as the caller."""

    command = RecordJournalException

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordJournalException, context: Context) -> JournalException:
        return self.repository.save(JournalException(environment_id=command.environment_id, creator_id=context.actor.id, source=command.source, message=command.message), context)

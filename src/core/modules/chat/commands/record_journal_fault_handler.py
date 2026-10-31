from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.repository.repository import Repository
from core.modules.chat.commands.record_journal_fault import RecordJournalFault
from core.modules.chat.models.journal_fault import JournalFault


class RecordJournalFaultHandler(Handler[RecordJournalFault, JournalFault]):
    """Saves the fault as the caller."""

    command = RecordJournalFault

    def __init__(self, repository: Repository) -> None:
        self.repository = repository

    def handle(self, command: RecordJournalFault, context: Context) -> JournalFault:
        return self.repository.save(JournalFault(environment_id=command.environment_id, creator_id=context.actor.id, source=command.source, message=command.message), context)

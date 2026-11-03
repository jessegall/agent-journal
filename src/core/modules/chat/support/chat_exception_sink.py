from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.exception_sink import ExceptionSink
from core.base.module.module_actors import ModuleActors
from core.modules.chat.commands.record_journal_exception.record_journal_exception import RecordJournalException

CHAT_MODULE = "journal.core.chat"
EXCEPTION_LISTENER = "listener chat.exception-mark"


class ChatExceptionSink(ExceptionSink):
    """Records each exception the journal meets as a row of the chat module, except an exception of the listener
    that shows exceptions, which would only make more of them. An exception met inside a transaction waits until
    the commit listeners next run."""

    def __init__(self, bus: Bus, actors: ModuleActors, database: Database) -> None:
        self.bus, self.actors, self.database = bus, actors, database
        self.waiting: list[RecordJournalException] = []

    def record(self, source: str, message: str, environment_id: int | None) -> None:
        if source.startswith(EXCEPTION_LISTENER):
            return
        self.waiting.append(RecordJournalException(environment_id, source, message))
        if not self.database.has_transaction:
            self.flush()

    def flush(self) -> None:
        while self.waiting and not self.database.has_transaction:
            exception = self.waiting.pop(0)
            self.bus.run(exception, self.actors.actor(CHAT_MODULE), environment_id=exception.environment_id)

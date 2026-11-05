from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.exception_sink import ExceptionSink
from core.base.module.module_actors import ModuleActors
from core.base.timestamp import Timestamp
from core.modules.chat.commands.record_journal_exception.record_journal_exception import RecordJournalException

CHAT_MODULE = "journal.core.chat"
EXCEPTION_LISTENER = "listener chat.exception-mark"
REPEAT_LIMIT_SECONDS = 60


class ChatExceptionSink(ExceptionSink):
    """Records each exception the journal meets as a row of the chat module, except an exception of the
    listener that shows exceptions, which would only make more of them, and an exception with the message
    of one recorded in the last minute, so a listener that fails on every event cannot flood the chat; its
    trace is in the error file. An exception met inside a transaction waits until the commit listeners
    next run."""

    def __init__(self, bus: Bus, actors: ModuleActors, database: Database, clock: Clock) -> None:
        self.bus, self.actors, self.database, self.clock = bus, actors, database, clock
        self.waiting: list[RecordJournalException] = []
        self.recorded_at: dict[str, Timestamp] = {}

    def record(self, source: str, message: str, environment_id: int | None) -> None:
        if source.startswith(EXCEPTION_LISTENER) or self.is_repeat(message):
            return
        self.waiting.append(RecordJournalException(environment_id, source, message))
        if not self.database.has_transaction:
            self.flush()

    def is_repeat(self, message: str) -> bool:
        current_time = self.clock.timestamp()
        recorded_at = self.recorded_at.get(message)
        if recorded_at is not None and recorded_at.elapsed_seconds(current_time) < REPEAT_LIMIT_SECONDS:
            return True
        self.recorded_at[message] = current_time
        return False

    def flush(self) -> None:
        while self.waiting and not self.database.has_transaction:
            exception = self.waiting.pop(0)
            self.bus.run(exception, self.actors.actor(CHAT_MODULE), environment_id=exception.environment_id)

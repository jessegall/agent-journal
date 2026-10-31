from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.fault_sink import FaultSink
from core.base.module.module_actors import ModuleActors
from core.modules.chat.commands.record_journal_fault import RecordJournalFault

CHAT_MODULE = "journal.core.chat"
FAULT_LISTENER = "listener chat.fault-mark"


class ChatFaultSink(FaultSink):
    """Records each fault the journal meets as a row of the chat module, except a fault of the listener
    that shows faults, which would only make more of them. A fault met inside a transaction waits until
    the commit listeners next run."""

    def __init__(self, bus: Bus, actors: ModuleActors, database: Database) -> None:
        self.bus, self.actors, self.database = bus, actors, database
        self.waiting: list[RecordJournalFault] = []

    def record(self, source: str, message: str, environment_id: int | None) -> None:
        if source.startswith(FAULT_LISTENER):
            return
        self.waiting.append(RecordJournalFault(environment_id, source, message))
        if not self.database.has_transaction:
            self.flush()

    def flush(self) -> None:
        while self.waiting and not self.database.has_transaction:
            fault = self.waiting.pop(0)
            self.bus.run(fault, self.actors.actor(CHAT_MODULE), environment_id=fault.environment_id)

from core.base.command.bus import Bus
from core.base.fault_sink import FaultSink
from core.base.module.module_actors import ModuleActors
from core.modules.chat.commands.record_journal_fault import RecordJournalFault

CHAT_MODULE = "journal.core.chat"
FAULT_LISTENER = "listener chat.fault-mark"


class ChatFaultSink(FaultSink):
    """Records each fault the journal meets as a row of the chat module, except a fault of the listener that shows
    faults, which would only make more of them."""

    def __init__(self, bus: Bus, actors: ModuleActors) -> None:
        self.bus, self.actors = bus, actors

    def record(self, source: str, message: str, environment_id: int | None) -> None:
        if not source.startswith(FAULT_LISTENER):
            self.bus.run(RecordJournalFault(environment_id, source, message), self.actors.actor(CHAT_MODULE), environment_id=environment_id)

from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.chat_mark_variant import ChatMarkVariant
from core.modules.chat.models.journal_fault import JournalFault

LISTENER_SOURCE = "listener"


class JournalFaultMarkListener(MarkListener):
    """When a fault is recorded, the chat shows a fault mark with what went wrong and where."""

    name = "chat.fault-mark"
    event = "journal_fault.create"
    module_name = "journal.core.chat"

    def handle(self, event: LoggedEvent) -> None:
        fault = self.queries.query(JournalFault).find(event.row_id)
        variant = ChatMarkVariant.LISTENER_FAILED if fault.source.startswith(LISTENER_SOURCE) else ChatMarkVariant.COMMAND_FAILED
        self.show(event, ChatMarkType.FAULT, variant, f"{fault.message} ({fault.source})", fault.environment_id, None, "journal-fault", fault.id)

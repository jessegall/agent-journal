from core.base.change.logged_event import LoggedEvent
from core.base.scope.actor_scope import ActorScope
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.chat_mark_variant import ChatMarkVariant
from core.modules.chat.models.journal_exception import JournalException
from core.base.change.created import Created

LISTENER_SOURCE = "listener"


class JournalExceptionMarkListener(MarkListener[Created[JournalException]]):
    """When an exception is recorded, the chat shows an exception mark with what went wrong and where."""

    name = "chat.exception-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.core.chat"

    def handle(self, event: Created[JournalException], logged: LoggedEvent) -> None:
        exception = event.row
        variant = ChatMarkVariant.LISTENER_FAILED if exception.source.startswith(LISTENER_SOURCE) else ChatMarkVariant.COMMAND_FAILED
        self.show(logged, ChatMarkType.EXCEPTION, variant, f"{exception.message} ({exception.source})", exception.environment_id, None, "journal-exception", exception.id)

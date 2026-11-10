from engine.change.logged_event import LoggedEvent
from engine.time.clock import Clock
from engine.log.exception_sink import CLOCK_TICK_SOURCE
from engine.command.bus import Bus
from core.base.module.module_actors import ModuleActors
from engine.query.queries import Queries
from core.base.listener.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.chat_mark_variant import ChatMarkVariant
from core.modules.chat.models.journal_exception import JournalException
from core.modules.chat.support.chat_settings import EXCEPTION_MARK_SECONDS
from core.modules.settings.bindings.support.setting_values import SettingValues
from engine.change.created import Created

LISTENER_SOURCE = "listener"


class JournalExceptionMarkListener(MarkListener[Created[JournalException]]):
    """When an exception is recorded, the chat shows an exception mark with what went wrong and where; one older
    than the exception mark seconds when this listener reaches it is a backlog and shows nothing."""

    name = "chat.exception-mark"
    disabled_scopes = [ActorScope]
    module_name = "journal.core.chat"

    def __init__(self, bus: Bus, actors: ModuleActors, queries: Queries, clock: Clock, event_rows: EventRows, settings: SettingValues) -> None:
        super().__init__(bus, actors, queries, event_rows)
        self.clock, self.settings = clock, settings

    @staticmethod
    def variant(source: str) -> ChatMarkVariant:
        if source.startswith(LISTENER_SOURCE):
            return ChatMarkVariant.LISTENER_FAILED
        return ChatMarkVariant.TICK_COSTLY if source == CLOCK_TICK_SOURCE else ChatMarkVariant.COMMAND_FAILED

    def handle(self, event: Created[JournalException], logged: LoggedEvent) -> None:
        exception = event.row
        if self.settings.seconds(EXCEPTION_MARK_SECONDS).has_elapsed(exception.creation_timestamp(), self.clock.timestamp()):
            return
        variant = self.variant(exception.source)
        self.show(logged, ChatMarkType.EXCEPTION, variant, f"{exception.message} ({exception.source})", None, "journal-exception", exception.id)

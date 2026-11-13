from engine.enums.mark_outcome import MarkOutcome
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.context_compaction_notice import ContextCompactionNotice
from core.modules.drivers.models.enums.compaction_mark_type import CompactionMarkType
from core.modules.drivers.support.driver_settings import MODULE_KEY


class CompactionNoticeMarkListener(MarkListener[Created[ContextCompactionNotice]]):
    """Shows what a user is told about a compaction that went wrong, once, in the chat."""

    name = "drivers.compaction-notice-mark"
    module_name = MODULE_KEY

    def handle(self, event: Created[ContextCompactionNotice], logged: LoggedEvent) -> None:
        notice = event.row
        self.show(logged, CompactionMarkType.COMPACTION, notice.notice, notice.text, agent_id=notice.session_agent_id, outcome=MarkOutcome.FAILED)

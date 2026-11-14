from engine.event.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.waits.models.enums.wait_mark_type import WaitMarkType
from core.modules.waits.models.enums.wait_mark_variant import WaitMarkVariant
from core.modules.waits.models.enums.wait_type import WaitType
from core.modules.waits.models.wait import Wait
from engine.event.created import Created


class ReportedWaitMarkListener(MarkListener[Created[Wait]]):
    """When an agent reports it is stuck, the chat shows a reported wait mark with the reason it gave."""

    name = "waits.reported-wait-mark"
    module_name = "journal.core.waits"

    def handle(self, event: Created[Wait], logged: LoggedEvent) -> None:
        wait = event.row
        if wait.type is WaitType.HELP_REQUEST:
            self.show(logged, WaitMarkType.REPORTED_WAIT, WaitMarkVariant.REPORTED, f"Stuck: {wait.focus}", wait.session_agent_id, "wait", wait.id)

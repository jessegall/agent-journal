from engine.change.created import Created
from engine.change.logged_event import LoggedEvent
from engine.chat.mark_outcome import MarkOutcome
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.drivers.models.enums.bypass_mark_type import BypassMarkType
from core.modules.drivers.models.enums.bypass_mark_variant import BypassMarkVariant
from core.modules.drivers.models.hook_timeout_notice import HookTimeoutNotice
from core.modules.drivers.support.driver_settings import MODULE_KEY


class HookTimeoutMarkListener(MarkListener[Created[HookTimeoutNotice]]):
    """Shows a notice of repeated hook timeouts once in the chat of the main agent told about it."""

    name = "drivers.hook-timeout-mark"
    module_name = MODULE_KEY

    def handle(self, event: Created[HookTimeoutNotice], logged: LoggedEvent) -> None:
        self.show(logged, BypassMarkType.BYPASS, BypassMarkVariant.TIMEOUTS, event.row.text, agent_id=event.row.receiver_id, outcome=MarkOutcome.FAILED)

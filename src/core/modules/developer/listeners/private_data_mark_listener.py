from core.base.change.created import Created
from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.private_data_mark_variant import PrivateDataMarkVariant
from core.modules.developer.models.private_data_mark import PrivateDataMark


class PrivateDataMarkListener(MarkListener[Created[PrivateDataMark]]):
    """Shows one card in the chat for each place the private data scan found."""

    name = "developer.private-data-mark"
    module_name = "journal.core.chat"

    def handle(self, event: Created[PrivateDataMark], logged: LoggedEvent) -> None:
        self.show(logged, ChatMarkType.PRIVATE_DATA, PrivateDataMarkVariant.DETECTED, event.row.text, key=event.row.finding_key)

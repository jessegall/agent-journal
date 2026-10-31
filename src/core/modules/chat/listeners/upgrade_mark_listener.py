import json

from core.base.change.logged_event import LoggedEvent
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.upgrade_mark_variant import UpgradeMarkVariant
from core.modules.environments.models.environment import Environment

SHOWN = ("tasks", "plans", "messages", "memories")


class UpgradeMarkListener(MarkListener):
    """After an upgrade from version 4, the chat of the first environment shows one mark telling how many tasks,
    plans, messages and memories moved, with the whole report to open."""

    name = "chat.upgrade-mark"
    event = "upgrade.finished"
    module_name = "journal.core.chat"

    def handle(self, event: LoggedEvent) -> None:
        environments = self.queries.query(Environment).oldest().page(1, 1).rows
        counts = {table: rows for table, rows in event.data["counts"][1].items()} if isinstance(event.data["counts"][1], dict) else {}
        text = "Upgraded from version 4: " + ", ".join(f"{counts.get(table, 0)} {table}" for table in SHOWN) + " moved"
        if environments:
            self.show(event, ChatMarkType.UPGRADE, UpgradeMarkVariant.VERSION_FOUR, text, environments[0].id, None, "", None, str(event.data["report"][1]))

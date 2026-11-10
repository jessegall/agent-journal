from engine.change.logged_event import LoggedEvent
from engine.types.type_guards import is_mapping
from core.modules.chat.listeners.mark_listener import MarkListener
from core.modules.chat.models.enums.chat_mark_type import ChatMarkType
from core.modules.chat.models.enums.upgrade_mark_variant import UpgradeMarkVariant
from core.modules.environments.models.environment import Environment
from engine.change.upgrade_finished import UpgradeFinished

SHOWN = ("tasks", "plans", "messages", "memories")


class UpgradeMarkListener(MarkListener[UpgradeFinished]):
    """After an upgrade from version 4, the chat of the first environment shows one mark telling how many
    tasks, plans, messages and memories moved, with the whole report to open."""

    name = "chat.upgrade-mark"
    module_name = "journal.core.chat"

    def handle(self, event: UpgradeFinished, logged: LoggedEvent) -> None:
        environment = self.queries.query(Environment).oldest().first()
        counts = logged.data["counts"][1]
        text = "Upgraded from version 4: " + ", ".join(f"{counts.get(table, 0) if is_mapping(counts) else 0} {table}" for table in SHOWN) + " moved"
        if environment is not None:
            with self.bus.scopes.opened(None, environment.id):
                self.show(logged, ChatMarkType.UPGRADE, UpgradeMarkVariant.VERSION_FOUR, text, detail=str(logged.data["report"][1]))

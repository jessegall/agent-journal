from engine.database.kept_rows import KeptRows
from engine.scope.scopes import Scopes
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery

DOCKED_REASON = "The items docked in one chat, which the dock's capacity bounds; the dock reads them from this one kept load."


class ChatDockedItems:
    """The items docked in the chat of the agent in scope, oldest first, read once and kept: the dock keeps
    the list up to date as it docks and undocks, and it is read again only when the table changes some
    other way."""

    def __init__(self, items: DockItemQuery, kept: KeptRows, scopes: Scopes) -> None:
        self.items, self.kept, self.scopes = items, kept, scopes

    def read(self, dock_id: int) -> list[DockItem]:
        agent_id = self.scopes.actor_id
        return self.kept.read(self.items.docked(dock_id), lambda: list(self.items.docked(dock_id).same_chat(agent_id).every_row(DOCKED_REASON)),
                              name=self.name(agent_id))

    def docked(self, item: DockItem) -> None:
        def with_item(previous: list[DockItem]) -> list[DockItem]:
            return [*previous, item]

        self.kept.update(self.items.docked(item.dock_id), with_item, name=self.name(self.scopes.actor_id))

    def undocked(self, item: DockItem) -> None:
        def without_item(previous: list[DockItem]) -> list[DockItem]:
            return [kept for kept in previous if kept.id != item.id]

        self.kept.update(self.items.docked(item.dock_id), without_item, name=self.name(self.scopes.actor_id))

    @staticmethod
    def name(agent_id: int | None) -> str:
        return f"docking.chat_items:{agent_id}"

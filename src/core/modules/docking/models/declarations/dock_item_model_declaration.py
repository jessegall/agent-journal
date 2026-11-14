from engine.module.model_declaration import ModelDeclaration
from core.modules.docking.models.dock_item import DockItem
from core.modules.docking.queries.dock_item_query import DockItemQuery


class DockItemModelDeclaration(ModelDeclaration):
    """How the module declares DockItem."""

    model = DockItem
    query = DockItemQuery

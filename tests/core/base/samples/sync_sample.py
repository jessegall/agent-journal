from tests.core.base.listener.test_commit_listener_runner import PausedItemCounter
from tests.core.base.module.test_module_check import PausedItemGuard
from core.base.database.migration import Migration
from core.base.module.module import Module
from core.base.module.model_declaration import ModelDeclaration
from tests.core.base.sample_container import ITEMS
from tests.core.base.model.test_model import Item


class ItemsTable(Migration):
    number = 1
    statements = [ITEMS]


class ItemsModule(Module):
    name = "items"
    requires_core = ">=5,<6"
    models = [ModelDeclaration(Item)]
    migrations = [ItemsTable]
    guards = [PausedItemGuard]


class ItemCountModule(Module):
    name = "item-count"
    requires_core = ">=5,<6"
    dependencies = ["items"]
    listeners = [PausedItemCounter]


class ItemsTableRemoval(Migration):
    number = 0
    statements = ["DROP TABLE items"]


class RemovableItemsModule(ItemsModule):
    removal = ItemsTableRemoval

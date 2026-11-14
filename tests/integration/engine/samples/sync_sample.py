from tests.integration.engine.listener.commit.test_commit_listener_runner import PausedItemCounter
from tests.integration.engine.module.test_module_check import PausedItemGuard
from engine.database.migration import Migration
from engine.module.module import Module
from engine.module.model_declaration import ModelDeclaration
from tests.integration.engine.samples.sample_container import ITEMS
from tests.unit.engine.model.test_model import Item


class ItemsTable(Migration):
    number = 1
    statements = [ITEMS]


class ItemsModule(Module):
    name = "items"
    requires_engine = ">=5,<6"
    models = [ModelDeclaration(Item)]
    migrations = [ItemsTable]
    guards = [PausedItemGuard]


class ItemCountModule(Module):
    name = "item-count"
    requires_engine = ">=5,<6"
    dependencies = ["items"]
    listeners = [PausedItemCounter]


class ItemsTableRemoval(Migration):
    number = 0
    statements = ["DROP TABLE items"]


class RemovableItemsModule(ItemsModule):
    removal = ItemsTableRemoval

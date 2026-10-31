from core.base.database.migration import Migration
from core.base.module.module import Module
from core.base.module.noun import Noun
from tests.core.base.harness import ITEMS
from tests.core.base.model.test_model import Item


class ItemsTable(Migration):
    number = 1
    statements = (ITEMS,)


class ItemsModule(Module):
    name = "items"
    requires_core = ">=5,<6"
    nouns = (Noun(Item),)
    migrations = ("tests.core.base.samples.sync_sample:ItemsTable",)
    guards = ("tests.core.base.module.test_module_check:PausedItemGuard",)


class ItemCountModule(Module):
    name = "item-count"
    requires_core = ">=5,<6"
    dependencies = ("items",)
    listeners = ("tests.core.base.listener.test_commit_listener_runner:CountPause",)


class ItemsTableRemoval(Migration):
    number = 0
    statements = ("DROP TABLE items",)


class RemovableItemsModule(ItemsModule):
    removal = "tests.core.base.samples.sync_sample:ItemsTableRemoval"

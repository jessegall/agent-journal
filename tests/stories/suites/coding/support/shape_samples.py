from engine.enums.window_loading import WindowLoading
from engine.module.module import Module
from engine.module.suite import Suite
from engine.viewer.entry_point import EntryPoint
from engine.viewer.skeleton_part import SkeletonPart
from engine.viewer.window import Window


class StockWindow(Window):
    """A made-up window that lists the tasks as stock."""

    name = "sample-shop.stock"
    title = "Stock"
    entry = "task list"
    loading = WindowLoading.DOCUMENT
    skeleton = [SkeletonPart.line()]
    reads = ["task list"]


SHOP_WINDOWS = [StockWindow]


class ShopEntryPoint(EntryPoint):
    """The way into the made-up shop: its stock and the chat."""

    key = "shop"
    windows = [StockWindow, "messages.chat"]


class ShopModule(Module):
    """A made-up module written in the coding module's shape: a name, its dependencies and one list per folder."""

    name = "sample-shop"
    requires_engine = ">=5,<6"
    dependencies = ["journal.core.tasks", "journal.core.viewer", "journal.core.messages", "journal.core.agents"]
    windows = SHOP_WINDOWS


class ShopSuite(Suite):
    """A made-up suite that ships the shop module through its entry point."""

    name = "sample-shop"
    modules = [ShopModule]
    entry_points = [ShopEntryPoint]

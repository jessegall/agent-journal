import pytest

from engine.errors.refusal import Refusal
from engine.module.module import Module
from engine.viewer.window_extension import WindowExtension
from engine.viewer.window_key import WindowKey
from engine.viewer.window_tab import WindowTab


class StockKey(WindowKey):
    name = "stock.*"
    read = "stock list --shelf {id}"
    page_size = 20


class ShelfTabsExtension(WindowExtension):
    reads = ["stock list"]
    keys = [StockKey]
    tabs = [WindowTab("stock", "Stock", "stock list")]


class ShelvesStockExtension(ShelfTabsExtension):
    window = "shop.shelves"


class TillLinkExtension(WindowExtension):
    window = "shop.till"
    links = {"shelves": "shop.shelves"}


class InlineKeyExtension(WindowExtension):
    window = "shop.till"
    keys = [WindowKey("stock", "stock list")]


class ShopModule(Module):
    name = "shop"
    window_extensions = [ShelvesStockExtension, TillLinkExtension, WindowExtension("shop.orders", reads=["order list"])]


def test_an_extension_class_gives_the_extension_the_inline_call_gave():
    inline = WindowExtension("shop.shelves", reads=["stock list"], keys=(WindowKey("stock.*", "stock list --shelf {id}", page_size=20),), tabs=[WindowTab("stock", "Stock", "stock list")])
    assert ShelvesStockExtension.declared() == inline


def test_an_extension_without_links_gets_a_dictionary_of_its_own():
    assert TillLinkExtension.declared().links == {"shelves": "shop.shelves"} and ShelvesStockExtension.declared().links == {}


def test_an_extension_class_that_lists_an_inline_key_is_refused():
    with pytest.raises(Refusal, match="is no key class"):
        InlineKeyExtension.declared()


def test_a_module_gives_the_declarations_of_its_extension_classes_beside_its_inline_ones():
    assert [extension.window for extension in ShopModule.extension_declarations()] == ["shop.shelves", "shop.till", "shop.orders"]

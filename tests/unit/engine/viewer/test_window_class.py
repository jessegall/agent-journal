import pytest

from engine.enums.key_loading import KeyLoading
from engine.enums.window_loading import WindowLoading
from engine.enums.window_place import WindowPlace
from engine.errors.refusal import Refusal
from engine.module.module import Module
from engine.viewer.window import Window
from engine.viewer.window_declaration import WindowDeclaration
from engine.viewer.window_key import WindowKey


class ShelvesKey(WindowKey):
    name = "shelves"
    read = "shelf list"
    arguments = ["limit"]


class StockKey(WindowKey):
    name = "stock"
    read = "stock list"
    loading = KeyLoading.REQUESTED


class ShelvesWindow(Window):
    name = "shop.shelves"
    title = "Shelves"
    entry = "shelves.js"
    loading = WindowLoading.COMPONENT
    place = WindowPlace.PAGE
    keys = [ShelvesKey, StockKey]


class ReadingShelvesWindow(ShelvesWindow):
    name = "shop.reading-shelves"
    reads = ["shelf list"]


class InlineKeyWindow(ShelvesWindow):
    keys = [WindowKey("shelves", "shelf list")]


class ShopModule(Module):
    name = "shop"
    windows = [ShelvesWindow, WindowDeclaration("shop.till", "Till", "till.js", WindowLoading.COMPONENT)]


def test_a_window_class_gives_the_declaration_the_inline_call_gave():
    inline = WindowDeclaration("shop.shelves", "Shelves", "shelves.js", WindowLoading.COMPONENT, place=WindowPlace.PAGE, reads=["shelf list", "stock list"],
                               keys=[WindowKey("shelves", "shelf list", arguments=["limit"]), WindowKey("stock", "stock list", loading=KeyLoading.REQUESTED)])
    declared = ShelvesWindow.declaration()
    assert declared == WindowDeclaration(**{**vars(inline), "reads": tuple(inline.reads), "keys": tuple(inline.keys)})


def test_a_window_that_names_its_reads_keeps_them():
    assert ReadingShelvesWindow.declaration().reads == ["shelf list"]


def test_a_key_that_is_not_a_class_is_refused():
    with pytest.raises(Refusal, match="is no key class"):
        InlineKeyWindow.declaration()


def test_a_module_gives_the_declarations_of_its_window_classes_beside_its_inline_ones():
    assert [window.name for window in ShopModule.window_declarations()] == ["shop.shelves", "shop.till"]

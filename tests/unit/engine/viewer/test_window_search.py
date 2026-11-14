from engine.viewer.menu_item import MenuItem
from engine.viewer.window_search import WindowSearch
from engine.viewer.model_searcher import ModelSearcher
from tests.unit.engine.model.test_model import Item


class SampleSearcher(ModelSearcher):
    model = Item


def test_a_menu_entry_opens_a_menu_or_sends_a_click():
    assert WindowSearch(SampleSearcher, "Search", [MenuItem("Order", next=[MenuItem("Newest", click="newest")])]).problems("notes.board") == []


def test_a_menu_entry_that_opens_a_menu_and_sends_a_click_is_a_problem():
    search = WindowSearch(SampleSearcher, "Search", [MenuItem("Order", next=[MenuItem("Newest", click="newest")], click="order")])
    assert search.problems("notes.board") == ["notes.board has the search menu entry Order, which both opens a menu and sends a click"]


def test_a_menu_entry_that_opens_no_menu_and_sends_no_click_is_a_problem():
    assert WindowSearch(SampleSearcher, "Search", [MenuItem("Order")]).problems("notes.board") == ["notes.board has the search menu entry Order, which opens no menu and sends no click"]


def test_a_search_with_no_placeholder_is_a_problem():
    assert WindowSearch(SampleSearcher, "").problems("notes.board") == ["notes.board declares a search with no placeholder"]


def test_a_search_lists_its_searcher_placeholder_menu_and_button():
    listed = WindowSearch(SampleSearcher, "Search", [MenuItem("Order", "How rows are sorted", click="order")]).listed()
    assert listed["placeholder"] == "Search" and listed["searcher"].endswith(":SampleSearcher") and listed["button"] == {}
    assert listed["context"] == [{"title": "Order", "subtext": "How rows are sorted", "next": [], "click": "order"}]

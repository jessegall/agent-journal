from engine.actor.actor import CORE_ACTOR_ID
from core.modules.processes.models.enums.reader_type import ReaderType
from core.modules.processes.models.reader import Reader
from core.modules.processes.models.enums.reader_layer import ReaderLayer
from core.modules.processes.support.reading.reader_layers import ReaderLayers

AGENT_ID = 7
NO_EDITS = ReaderLayers(frozenset())


def reader(name: str, row_id: int, creator_id: int = AGENT_ID, is_default: bool = False, plugin_name: str = "") -> Reader:
    return Reader(id=row_id, creator_id=creator_id, name=name, type=ReaderType.PATTERN, commands="pytest*",
                  is_default=is_default, plugin_name=plugin_name, shipped_digest="shipped" if creator_id == CORE_ACTOR_ID else "")


def names(readers: list[Reader]) -> list[str]:
    return [item.name for item in readers]


def test_project_readers_come_before_plugin_readers_before_stock_readers():
    stock = reader("stock", 3, creator_id=CORE_ACTOR_ID)
    plugin = reader("plugin", 2, plugin_name="cart-tools")
    project = reader("project", 1)
    assert names(NO_EDITS.ordered([stock, plugin, project])) == ["project", "plugin", "stock"]


def test_a_newer_stock_reader_does_not_come_before_an_older_project_reader():
    project = reader("project", 1)
    stock = reader("stock", 9, creator_id=CORE_ACTOR_ID, is_default=True)
    assert names(NO_EDITS.ordered([stock, project])) == ["project", "stock"]


def test_a_plugin_reader_sits_between_a_project_reader_and_a_stock_reader():
    stock = reader("stock", 1, creator_id=CORE_ACTOR_ID)
    project = reader("project", 2)
    plugin = reader("plugin", 3, plugin_name="cart-tools", creator_id=CORE_ACTOR_ID)
    assert names(NO_EDITS.ordered([plugin, stock, project])) == ["project", "plugin", "stock"]


def test_inside_a_layer_the_default_reader_comes_first_then_the_newest():
    older_default = reader("older-default", 1, is_default=True)
    newest = reader("newest", 5)
    newer = reader("newer", 3)
    assert names(NO_EDITS.ordered([newer, newest, older_default])) == ["older-default", "newest", "newer"]


def test_of_two_project_readers_without_a_default_the_newest_comes_first():
    older = reader("older", 1)
    newer = reader("newer", 2)
    assert names(NO_EDITS.ordered([older, newer])) == ["newer", "older"]


def test_a_stock_reader_that_was_edited_counts_as_a_project_reader():
    edited_stock = reader("edited-stock", 1, creator_id=CORE_ACTOR_ID, is_default=True)
    project = reader("project", 2)
    assert names(ReaderLayers(frozenset({1})).ordered([project, edited_stock])) == ["edited-stock", "project"]
    assert names(NO_EDITS.ordered([project, edited_stock])) == ["project", "edited-stock"]


def test_no_readers_give_no_readers():
    assert NO_EDITS.ordered([]) == []


def test_a_reader_a_person_made_is_a_project_reader_though_the_persons_number_is_the_cores():
    person_reader = Reader(id=7, creator_id=CORE_ACTOR_ID, name="person-tool", type=ReaderType.PATTERN, commands="pytest*")
    assert ReaderLayers(frozenset()).layer(person_reader) is ReaderLayer.PROJECT

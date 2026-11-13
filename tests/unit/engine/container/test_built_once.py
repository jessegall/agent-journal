import pytest

from engine.command.handler import Handler
from engine.container.container import Container
from engine.errors.built_twice_error import BuiltTwiceError
from engine.event.created import Created
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from tests.unit.engine.command.test_commands import MakeItem
from tests.unit.engine.model.test_model import Item


class CountedItems(CommitListener[Created[Item]]):
    name = "items.counted"

    def handle(self, event: Created[Item], logged: LoggedEvent) -> None:
        pass


class ModuleCountedItems(CountedItems):
    name = "items.module-counted"


class ItemMaker(Handler[MakeItem, None]):
    pass


class ModuleItemMaker(ItemMaker):
    pass


def built_twice(base: type, implementation: type) -> BuiltTwiceError:
    container = Container()
    container.substitute(base, implementation)
    container.get(base)
    with pytest.raises(BuiltTwiceError) as raised:
        container.get(implementation)
    return raised.value


def test_a_listener_built_twice_in_one_container_raises_naming_both_places():
    error = built_twice(CountedItems, ModuleCountedItems)
    assert error.class_type is ModuleCountedItems and str(error).count("test_built_once.py") >= 2


def test_a_handler_built_twice_in_one_container_raises():
    assert built_twice(ItemMaker, ModuleItemMaker).class_type is ModuleItemMaker


def test_a_second_container_builds_them_once_without_error():
    for _ in range(2):
        container = Container()
        assert container.get(CountedItems) is container.get(CountedItems) and container.get(ItemMaker) is container.get(ItemMaker)

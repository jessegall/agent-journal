import pytest

from engine.container.container import Container
from engine.errors.late_resolve_error import LateResolveError
from tests.unit.engine.container.test_single_instance import CountedItems, ItemMaker


class PlainValue:
    """A class the engine does not keep as one instance."""


def test_a_sealed_container_refuses_a_handler_or_listener_it_did_not_build_at_boot():
    container = Container()
    container.seal()
    with pytest.raises(LateResolveError, match="ItemMaker was built after boot"):
        container.get(ItemMaker)
    with pytest.raises(LateResolveError, match="CountedItems was built after boot"):
        container.get(CountedItems)


def test_a_sealed_container_hands_out_what_it_built_before_and_builds_plain_values():
    container = Container()
    maker = container.get(ItemMaker)
    container.seal()
    assert container.get(ItemMaker) is maker
    assert isinstance(container.get(PlainValue), PlainValue)


def test_a_new_container_builds_again_after_a_sealed_one():
    sealed = Container()
    sealed.seal()
    assert isinstance(Container().get(ItemMaker), ItemMaker)

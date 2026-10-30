from typing import Generic, TypeVar

import pytest

from core.base.container import Container, MissingHint

M = TypeVar("M")


class Clockwork:
    pass


class Tower:
    def __init__(self, clockwork: Clockwork, floors: int = 3) -> None:
        self.clockwork, self.floors = clockwork, floors


class Bell:
    def __init__(self, tower: Tower) -> None:
        self.tower = tower


class Unhinted:
    def __init__(self, something) -> None:
        self.something = something


class Lookup(Generic[M]):
    def __init__(self, model: type) -> None:
        self.model = model


class PlainLookup(Lookup[Clockwork]):
    pass


def test_each_class_is_built_once_with_what_its_constructor_asks_for():
    container = Container()
    bell = container.get(Bell)
    assert bell.tower is container.get(Tower)
    assert bell.tower.clockwork is container.get(Clockwork)


def test_a_parameter_with_a_default_is_left_to_its_default():
    assert Container().get(Tower).floors == 3


def test_a_bound_value_is_given_instead_of_built():
    container = Container()
    clockwork = Clockwork()
    container.bind(Clockwork, clockwork)
    assert container.get(Tower).clockwork is clockwork


def test_the_container_gives_itself():
    container = Container()
    assert container.get(Container) is container


def test_a_parameter_without_a_type_is_a_clear_fault():
    with pytest.raises(MissingHint, match="something"):
        Container().get(Unhinted)


def test_a_family_of_classes_is_built_by_its_provider_for_each_member_and_subclass():
    container = Container()
    container.provide(Lookup, lambda built_by, kind: Lookup(kind))
    assert container.get(Lookup[Clockwork]).model == Lookup[Clockwork]
    assert container.get(PlainLookup).model is PlainLookup

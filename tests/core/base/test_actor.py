from dataclasses import FrozenInstanceError

import pytest

from core.base.actor import Actor, ActorType


def test_two_actors_with_one_id_and_type_are_the_same_actor():
    assert Actor(7, ActorType.AGENT) == Actor(7, ActorType.AGENT)
    assert Actor(7, ActorType.AGENT) != Actor(7, ActorType.MODULE)


def test_an_actor_cannot_be_changed():
    actor = Actor(7, ActorType.AGENT)
    with pytest.raises(FrozenInstanceError):
        actor.id = 8


def test_the_core_is_an_actor_of_its_own():
    assert Actor.core().type is ActorType.CORE

from enum import StrEnum

from core.base.model.added_state import AddedState
from core.base.model.table import loaded_state


class SampleState(StrEnum):
    OPEN = "open"


def test_an_added_state_reads_like_an_enum_member():
    state = AddedState("reviewing")
    assert state == "reviewing"
    assert state.value == "reviewing"
    assert str(state) == "reviewing"
    assert f"{state}" == "reviewing"
    assert {state: 1}["reviewing"] == 1


def test_a_known_word_loads_as_the_enum_member():
    assert loaded_state(SampleState, "open") is SampleState.OPEN


def test_an_unknown_word_loads_as_an_added_state():
    state = loaded_state(SampleState, "reviewing")
    assert isinstance(state, AddedState)
    assert state == "reviewing"


def test_an_empty_state_stays_empty():
    assert loaded_state(SampleState, None) is None

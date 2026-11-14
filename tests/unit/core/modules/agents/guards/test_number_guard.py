from types import SimpleNamespace

import pytest

from core.modules.agents.guards.number_guard import NumberGuard
from engine.errors.refusal import Refusal


def updated(old_number: int, new_number: int) -> SimpleNamespace:
    return SimpleNamespace(old_row=SimpleNamespace(number=old_number), row=SimpleNamespace(number=new_number))


def test_an_update_that_changes_the_number_is_refused():
    with pytest.raises(Refusal, match="the number of an agent cannot be changed"):
        NumberGuard().check(updated(2, 9), SimpleNamespace())


def test_an_update_that_leaves_the_number_alone_goes_through():
    NumberGuard().check(updated(2, 2), SimpleNamespace())

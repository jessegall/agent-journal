from contextlib import contextmanager
from types import SimpleNamespace

import pytest

from core.modules.agents.models.agent_fold import AgentFold
from core.modules.agents.support.agent_numbers import AgentNumbers


class FakeAgentQuery:
    """The agents of one environment, as far as the number giver reads them."""

    def __init__(self, numbers: list[int]) -> None:
        self.numbers = numbers

    def with_removed(self) -> "FakeAgentQuery":
        return self

    def filter(self, number: int) -> "FakeAgentQuery":
        return FakeAgentQuery([used for used in self.numbers if used == number])

    def exists(self) -> bool:
        return bool(self.numbers)

    def descending(self, column: str) -> "FakeAgentQuery":
        return FakeAgentQuery(sorted(self.numbers, reverse=True))

    def first(self) -> SimpleNamespace | None:
        return SimpleNamespace(number=self.numbers[0]) if self.numbers else None


class FakeFoldQuery:
    """The folded main rows, as far as the number giver reads them."""

    def __init__(self, numbers: list[int]) -> None:
        self.numbers = numbers

    def descending(self, column: str) -> "FakeFoldQuery":
        return FakeFoldQuery(sorted(self.numbers, reverse=True))

    def first(self) -> SimpleNamespace | None:
        return SimpleNamespace(folded_number=self.numbers[0]) if self.numbers else None


class FakeScopes:
    @contextmanager
    def opened(self, actor_id: int | None, environment_id: int):
        yield


def agent_numbers(used: list[int], folded: tuple[int, ...] = ()) -> AgentNumbers:
    return AgentNumbers(SimpleNamespace(query=lambda model: FakeFoldQuery(list(folded)) if model is AgentFold else FakeAgentQuery(used)), FakeScopes())


@pytest.mark.parametrize(("used", "role", "expected"), [
    ([], "main", 1),
    ([], "worker", 2),
    ([2, 3], "main", 1),
    ([1], "main", 2),
    ([1, 2, 7], "worker", 8),
    ([1], "helper", 2),
])
def test_a_main_agent_takes_one_while_it_is_free_and_any_other_agent_the_highest_number_plus_one(used, role, expected):
    assert agent_numbers(used).next_number(1, role) == expected


def test_a_new_agent_never_takes_the_number_of_a_folded_main_row():
    assert agent_numbers([1, 2, 5], folded=(33, 4)).next_number(1, "worker") == 34

from contextlib import contextmanager
from types import SimpleNamespace

import pytest

from core.modules.agents.support.agent_numbers import AgentNumbers


class FakeAgentQuery:
    """The agents of one environment, as far as the number giver reads them."""

    def __init__(self, numbers: list[int]) -> None:
        self.numbers = numbers

    def with_removed(self) -> "FakeAgentQuery":
        return self

    def filter(self, number: int) -> "FakeAgentQuery":
        return FakeAgentQuery([taken for taken in self.numbers if taken == number])

    def exists(self) -> bool:
        return bool(self.numbers)

    def descending(self, column: str) -> "FakeAgentQuery":
        return FakeAgentQuery(sorted(self.numbers, reverse=True))

    def first(self) -> SimpleNamespace | None:
        return SimpleNamespace(number=self.numbers[0]) if self.numbers else None


class FakeScopes:
    @contextmanager
    def opened(self, actor_id: int | None, environment_id: int):
        yield


def agent_numbers(taken: list[int]) -> AgentNumbers:
    return AgentNumbers(SimpleNamespace(query=lambda model: FakeAgentQuery(taken)), FakeScopes())


@pytest.mark.parametrize(("taken", "role", "expected"), [
    ([], "main", 1),
    ([], "worker", 2),
    ([2, 3], "main", 1),
    ([1], "main", 2),
    ([1, 2, 7], "worker", 8),
    ([1], "helper", 2),
])
def test_a_main_agent_takes_one_while_it_is_free_and_any_other_agent_the_highest_number_plus_one(taken, role, expected):
    assert agent_numbers(taken).next_number(1, role) == expected

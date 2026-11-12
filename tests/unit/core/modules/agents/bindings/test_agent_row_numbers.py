from contextlib import contextmanager
from types import SimpleNamespace

import pytest

from core.modules.agents.bindings.agent_row_numbers import AgentRowNumbers
from engine.errors.refusal import Refusal

AGENTS = [SimpleNamespace(id=10, environment_id=1, number=1), SimpleNamespace(id=11, environment_id=1, number=2),
          SimpleNamespace(id=20, environment_id=2, number=2), SimpleNamespace(id=21, environment_id=2, number=3),
          SimpleNamespace(id=30, environment_id=3, number=1)]
ENVIRONMENT_NAMES = {1: "main", 2: "shop", 3: "depot"}


class FakeScopes:
    environment_id: int | None = None

    @contextmanager
    def opened(self, actor_id: int | None, environment_id: int | None = None, disabled: tuple = ()):
        self.environment_id = environment_id
        yield


class FakeAgentQuery:
    lookups: list[list[int]] = []

    def __init__(self, scopes: FakeScopes, agents: list[SimpleNamespace]) -> None:
        self.scopes, self.agents = scopes, agents

    def filter(self, number: int) -> "FakeAgentQuery":
        return FakeAgentQuery(self.scopes, [agent for agent in self.agents if agent.number == number and agent.environment_id == self.scopes.environment_id])

    def first(self) -> SimpleNamespace | None:
        return self.agents[0] if self.agents else None

    def find(self, row_id: int) -> SimpleNamespace:
        return next(agent for agent in self.agents if agent.id == row_id)

    def find_many(self, row_ids: list[int]) -> list[SimpleNamespace]:
        self.lookups.append(sorted(row_ids))
        return [agent for agent in self.agents if agent.id in row_ids]


@pytest.fixture
def numbers() -> AgentRowNumbers:
    scopes = FakeScopes()
    environments = SimpleNamespace(find=lambda environment_id: SimpleNamespace(name=ENVIRONMENT_NAMES[environment_id]))
    return AgentRowNumbers(SimpleNamespace(query=lambda model: FakeAgentQuery(scopes, AGENTS)), scopes, environments)


@pytest.mark.parametrize("agent", AGENTS)
def test_a_number_finds_the_agent_of_its_environment_and_the_agent_has_that_number(numbers, agent):
    assert numbers.row_id("agent", agent.number, agent.environment_id) == agent.id
    assert numbers.number("agent", agent.id) == agent.number


def test_a_number_nobody_has_and_a_number_of_another_environment_are_refused_alike(numbers):
    with pytest.raises(Refusal) as absent:
        numbers.row_id("agent", 9, 1)
    with pytest.raises(Refusal) as elsewhere:
        numbers.row_id("agent", 3, 1)
    assert str(absent.value).replace("9", "N") == str(elsewhere.value).replace("3", "N")
    assert "no agent 9 in environment main" in str(absent.value)


def test_number_one_of_an_environment_without_a_main_agent_is_absent(numbers):
    with pytest.raises(Refusal, match="no agent 1 in environment shop"):
        numbers.row_id("agent", 1, 2)


def test_another_model_than_the_agent_is_a_programming_error(numbers):
    with pytest.raises(ValueError):
        numbers.row_id("task", 1, 1)


def test_a_number_read_in_no_environment_is_refused_and_never_read_as_a_row_id(numbers):
    with pytest.raises(Refusal, match="agent 3 is read in an environment, and this line runs in none"):
        numbers.row_id("agent", 3, None)
    with pytest.raises(Refusal, match="agent with row 3 is read in an environment, and this line runs in none"):
        numbers.environment_number("agent", 3, None)


def test_the_numbers_of_many_agents_are_read_in_one_lookup(numbers):
    FakeAgentQuery.lookups = []
    assert numbers.numbers("agent", {10, 20, 21}) == {10: 1, 20: 2, 21: 3}
    assert FakeAgentQuery.lookups == [[10, 20, 21]]

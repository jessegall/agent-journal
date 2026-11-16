from argparse import Namespace

from engine.cli.agent_id import AgentId
from engine.cli.agent_id_arguments import AgentIdArguments
from engine.cli.agent_ids import AgentIds

SHOP = 2


class ShopNumbers(AgentIds):
    """In the shop environment agent 2 is row 40 and agent 3 is row 41."""

    def row_id(self, model_name: str, number: int, environment_id: int | None) -> int:
        assert (model_name, environment_id) == ("agent", SHOP)
        return {2: 40, 3: 41}[number]

    def environment_number(self, model_name: str, row_id: int, environment_id: int | None) -> int:
        assert (model_name, environment_id) == ("agent", SHOP)
        return {40: 2, 41: 3}[row_id]


def test_an_agent_number_is_replaced_and_any_other_argument_is_left_as_it_is():
    arguments = Namespace(worker_id=AgentId("2"), task=2, job="2", agents=[AgentId("3"), AgentId("2")], tags=["2"])
    AgentIdArguments(ShopNumbers()).replace_numbers(arguments, SHOP)
    assert vars(arguments) == {"worker_id": 40, "task": 2, "job": "2", "agents": [41, 40], "tags": ["2"]}


def test_without_a_module_that_numbers_rows_a_number_is_the_row_id():
    arguments = Namespace(agent_id=AgentId("7"))
    AgentIdArguments(AgentIds()).replace_numbers(arguments, SHOP)
    assert arguments.agent_id == 7


def test_an_agent_written_by_its_row_is_kept_with_its_number():
    arguments = Namespace(agent_id=AgentId("row:41"))
    AgentIdArguments(ShopNumbers()).replace_numbers(arguments, SHOP)
    assert (arguments.agent_id, arguments.agent_id.number) == (41, 3)

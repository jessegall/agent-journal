from argparse import Namespace

from engine.cli.agent_number import AgentNumber
from engine.cli.agent_number_arguments import AgentNumberArguments
from engine.cli.row_numbers import RowNumbers

SHOP = 2


class ShopNumbers(RowNumbers):
    """In the shop environment agent 2 is row 40 and agent 3 is row 41."""

    def row_id(self, model_name: str, number: int, environment_id: int | None) -> int:
        assert (model_name, environment_id) == ("agent", SHOP)
        return {2: 40, 3: 41}[number]

    def environment_number(self, model_name: str, row_id: int, environment_id: int | None) -> int:
        assert (model_name, environment_id) == ("agent", SHOP)
        return {40: 2, 41: 3}[row_id]


def test_an_agent_number_is_replaced_and_any_other_argument_is_left_as_it_is():
    arguments = Namespace(worker_id=AgentNumber("2"), task=2, job="2", agents=[AgentNumber("3"), AgentNumber("2")], tags=["2"])
    AgentNumberArguments(ShopNumbers()).replace_numbers(arguments, SHOP)
    assert vars(arguments) == {"worker_id": 40, "task": 2, "job": "2", "agents": [41, 40], "tags": ["2"]}


def test_without_a_module_that_numbers_rows_a_number_is_the_row_id():
    arguments = Namespace(agent_id=AgentNumber("7"))
    AgentNumberArguments(RowNumbers()).replace_numbers(arguments, SHOP)
    assert arguments.agent_id == 7


def test_an_agent_written_by_its_row_is_kept_with_its_number():
    arguments = Namespace(agent_id=AgentNumber("row:41"))
    AgentNumberArguments(ShopNumbers()).replace_numbers(arguments, SHOP)
    assert (arguments.agent_id, arguments.agent_id.number) == (41, 3)

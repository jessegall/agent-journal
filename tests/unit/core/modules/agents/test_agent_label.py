from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class RowFortyIsNumberFive(RowNumbers):
    def number(self, model_name: str, row_id: int) -> int:
        return {40: 5}[row_id]


def agent(role: str, number: int) -> Agent:
    return Agent(id=40, creator_id=1, session="s-1", program="claude", role=role, number=number)


def test_a_helper_is_named_by_its_role_and_its_number():
    assert AgentLabel.from_agent(agent("helper", 5)).text == "helper 5"


def test_the_main_agent_is_named_main_agent():
    assert AgentLabel.from_agent(agent("main", 1)).text == "main agent"


def test_an_agent_known_by_its_row_id_is_named_by_the_number_of_that_row():
    assert AgentLabel.from_row_id(40, RowFortyIsNumberFive()).text == "agent 5"
    assert AgentLabel.from_row_id(40, RowFortyIsNumberFive(), "Reviewer").text == "reviewer 5"

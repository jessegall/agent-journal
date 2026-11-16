from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel


def agent(role: str, agent_id: int) -> Agent:
    return Agent(id=agent_id, actor_id=agent_id, creator_id=0, session="s-1", program="claude", role=role)


def test_a_helper_is_named_by_its_role_and_its_id():
    assert AgentLabel.labelled(agent("helper", 5)).text == "helper 5"


def test_the_main_agent_is_named_main_agent():
    assert AgentLabel.labelled(agent("main", 1)).text == "main agent"


def test_an_agent_known_by_its_id_is_named_by_that_id():
    assert AgentLabel.labelled_row(40).text == "agent 40"
    assert AgentLabel.labelled_row(40, "Reviewer").text == "reviewer 40"

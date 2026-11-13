import json
import sqlite3
from pathlib import Path

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from engine.agent.agent_name import AgentName, agent_name

NAMES = json.loads((Path(__file__).resolve().parents[6] / "tests" / "snapshots" / "agent_names.json").read_text())


def sql_name(role: str, number: int) -> str:
    connection = sqlite3.connect(":memory:")
    connection.execute("CREATE TABLE agents (role TEXT, number INTEGER)")
    connection.execute("INSERT INTO agents VALUES (?, ?)", (role, number))
    return connection.execute(f"SELECT {agent_name('agents').sql()} FROM agents").fetchone()[0]


@pytest.mark.parametrize("name", NAMES, ids=lambda name: f"{name['role']} {name['number']}")
def test_the_name_of_an_agent_is_the_same_in_the_model_the_label_the_view_and_the_viewer_list(name):
    agent = Agent(id=1, creator_id=1, session="s-1", program="claude", role=name["role"], number=name["number"])
    assert agent.display_name == name["title"]
    assert AgentName(name["role"], name["number"]).title == name["title"]
    assert sql_name(name["role"], name["number"]) == name["title"]
    assert AgentLabel.from_agent(agent).text == name["label"]

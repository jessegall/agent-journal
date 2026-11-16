import json
import sqlite3
from pathlib import Path

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_label import AgentLabel
from engine.agent.agent_name import AgentName, agent_name

NAMES = json.loads((Path(__file__).resolve().parents[5] / "tests" / "snapshots" / "agent_names.json").read_text())


def sql_name(role: str, agent_id: int) -> str:
    connection = sqlite3.connect(":memory:")
    connection.execute("CREATE TABLE agents (role TEXT, id INTEGER)")
    connection.execute("INSERT INTO agents VALUES (?, ?)", (role, agent_id))
    return connection.execute(f"SELECT {agent_name('agents').sql()} FROM agents").fetchone()[0]


@pytest.mark.parametrize("name", NAMES, ids=lambda name: f"{name['role']} {name['id']}")
def test_the_name_of_an_agent_is_the_same_in_the_model_the_label_the_view_and_the_viewer_list(name):
    agent = Agent(id=name["id"], actor_id=name["id"], creator_id=0, session="s-1", program="claude", role=name["role"])
    assert agent.display_name == name["title"]
    assert AgentName(name["role"], name["id"]).title == name["title"]
    assert sql_name(name["role"], name["id"]) == name["title"]
    assert AgentLabel.labelled(agent).text == name["label"]

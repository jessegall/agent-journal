import pytest

from engine.cli.agent_id import AgentId


def test_an_agent_id_is_a_whole_number_from_one():
    assert AgentId("4") == 4


@pytest.mark.parametrize("text", ["0", "-3", "row:5", "x", "12345678901234567890"])
def test_anything_else_is_no_agent_id(text):
    with pytest.raises(ValueError, match="is no agent id"):
        AgentId(text)

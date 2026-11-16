import pytest

from engine.cli.agent_id import AgentId


@pytest.mark.parametrize("text", ["0", "-3", "1e3", "12345678901234567890", "two", ""])
def test_text_that_is_no_positive_whole_number_of_at_most_19_digits_is_refused(text):
    with pytest.raises(ValueError):
        AgentId(text)


@pytest.mark.parametrize("text", ["1", "42", "9999999999999999999"])
def test_a_positive_whole_number_of_at_most_19_digits_is_an_agent_number(text):
    assert AgentId(text) == int(text) and isinstance(AgentId(text), int)

import pytest

from engine.cli.agent_number import AgentNumber


@pytest.mark.parametrize("text", ["0", "-3", "1e3", "12345678901234567890", "two", ""])
def test_text_that_is_no_positive_whole_number_of_at_most_19_digits_is_refused(text):
    with pytest.raises(ValueError):
        AgentNumber(text)


@pytest.mark.parametrize("text", ["1", "42", "9999999999999999999"])
def test_a_positive_whole_number_of_at_most_19_digits_is_an_agent_number(text):
    assert AgentNumber(text) == int(text) and isinstance(AgentNumber(text), int)

from core.modules.agents.agents_module import AgentsModule
from tests.stories.support.story_checks import expect_value


def agents_keys() -> dict:
    window = next(window for window in AgentsModule.windows if window.name == "agents.agents")
    return {key.name: key for key in window.keys}


def test_a_hook_call_does_not_read_the_agent_list():
    expect_value("hook_call.*" in agents_keys()["agents"].events, False)


def test_a_hook_call_reads_the_card_of_the_agent_it_names():
    card = agents_keys()["card.*"]
    expect_value("hook_call.*" in card.events, True)
    expect_value(card.listed()["event_column"], "session_agent_id")

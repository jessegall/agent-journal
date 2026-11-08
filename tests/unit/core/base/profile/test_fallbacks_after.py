from core.base.profile.agent_profile import AgentProfile

REGISTERED = ["claude", "codex", "gemini"]


def profile(*fallbacks: str) -> AgentProfile:
    return AgentProfile("reader", description="Reads", body="Read.", program="claude", fallback_programs=fallbacks)


def test_a_profile_with_no_list_tries_every_other_registered_program_in_their_order():
    assert profile().fallbacks_after("claude", REGISTERED) == ("codex", "gemini")


def test_a_profile_with_a_list_tries_those_programs_in_the_order_it_names_them():
    assert profile("gemini", "codex").fallbacks_after("claude", REGISTERED) == ("gemini", "codex")


def test_the_program_that_could_not_start_and_a_repeated_name_are_left_out_of_the_list():
    assert profile("claude", "gemini", "gemini").fallbacks_after("claude", REGISTERED) == ("gemini",)

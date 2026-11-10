from core.base.profile.agent_profile import AgentProfile
from engine.provider.provider import Provider
from engine.provider.providers import Providers

PROFILE = AgentProfile("sample", "A sample", "Do the work.", model="sonnet", codex_model="gpt-6.1-terra")


def test_each_provider_names_the_model_of_a_profile_for_its_own_program(new_story):
    story = new_story()
    providers = story.container.get(Providers)
    story.expect_rows(providers.provider("claude").profile_model(PROFILE) == "sonnet", providers.provider("codex").profile_model(PROFILE) == "gpt-6.1-terra")


def test_a_provider_that_names_no_model_field_of_its_own_gets_the_profile_model(new_story):
    story = new_story()
    profile = AgentProfile("sample", "A sample", "Do the work.", program_models={"claude": "sonnet"})
    story.expect_rows(Provider.profile_model(story.container.get(Providers).provider("claude"), profile) == "sonnet")

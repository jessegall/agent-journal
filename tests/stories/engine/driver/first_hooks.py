from engine.enums.agent_role import AgentRole
from core.modules.agents.models.agent import Agent
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadStarted, SampleSuiteChoice
from tests.stories.engine.driver.support.hook_agents import hook_agent
from tests.stories.engine.driver.support.samples import SAMPLES


def test_a_resumed_sessions_first_hook_reopens_its_agent_instead_of_starting_another(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run(f"agent end {story.agent.id}")
    resumed = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.expect_rows(resumed == story.agent)
    story.expect_text("agent list --role main", "s-1")


def test_a_second_plain_session_takes_the_row_of_the_main_agent_that_runs_in_the_environment(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    first_id = story.agent.id
    story.hook("s-2", HookSamples.session_start())
    agents = {row.session: row for row in story.story_rows(Agent)}
    story.expect_rows(list(agents) == ["s-2"], agents["s-2"].id == first_id, agents["s-2"].ended_at is None, agents["s-2"].role == AgentRole.MAIN)

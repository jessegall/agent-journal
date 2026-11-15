from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES


def test_a_guard_that_refuses_agents_lets_a_person_through(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_refusal(f"edit-lock make {story.agent.id}", "the lead makes no edit lock itself", actor=story.agent)
    story.expect_success(f"edit-lock make {story.agent.id}", "state: open", actor=story.user)

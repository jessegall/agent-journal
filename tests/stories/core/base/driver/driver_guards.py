from tests.stories.core.support import story_lines as lines
from core.base.actor import Actor
from core.base.actor_type import ActorType
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_a_guard_a_driver_lists_applies_to_its_own_agents_and_to_no_person(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_refusal(f"edit-lock make {story.agent.id}", "the lead makes no edit lock itself", actor=story.agent)
    story.expect_success(f"edit-lock make {story.agent.id}", "state: open", actor=story.user)

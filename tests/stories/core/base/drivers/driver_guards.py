from tests.stories.core.support import story_lines as lines
from core.base.actor import Actor, ActorType
from tests.stories.core.base.drivers.support.fixtures import LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_guard_a_driver_lists_applies_to_its_own_agents_and_to_no_person(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.expect_refusal(lines.EDIT_LOCK, "the lead makes no edit lock itself", actor=Actor(1, ActorType.AGENT))
    story.expect_success(lines.EDIT_LOCK, "state: open", actor=story.user)

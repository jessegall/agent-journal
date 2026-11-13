from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadWaiting
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.core.support import story_lines as lines
from core.modules.waits.support.wait_nudges import WAIT_CHECK
from engine.testing.expectations.expected_nudge import expected_nudge


def test_a_wait_of_ten_minutes_tells_the_agent_to_check_on_it(new_story):
    story = new_story(SAMPLES, fixture=LeadWaiting)
    story.tick("s-1")
    story.expect_absent(f"agent-line list --agent {story.agent.id}", "you have waited", actor=story.agent)
    story.advance(timedelta(minutes=11))
    story.tick("s-1")
    story.expect_text(f"agent-line list --agent {story.agent.id}", expected_nudge(WAIT_CHECK), actor=story.agent)


def test_a_wait_that_ends_on_its_task_tells_the_agent_at_its_next_hook(new_story):
    story = new_story(SAMPLES, fixture=LeadWaiting)
    story.expect_success(lines.TASK_START, "state: started", actor=story.agent)
    story.run('task close 1 --outcome "Cart works"', actor=story.agent)
    story.expect_text(f"agent-line list --agent {story.agent.id}", "wait:1 is over", actor=story.agent)


def test_a_wait_another_agent_ends_still_tells_the_agent_that_waits(new_story):
    story = new_story(SAMPLES, fixture=LeadWaiting, environment="main")
    worker = Actor(story.new_row_id("agent start s-9 claude worker"), ActorType.AGENT)
    story.expect_success(lines.TASK_START, "state: started", actor=worker)
    story.run('task close 1 --outcome "Cart works"', actor=worker)
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", "wait:1 is over", actor=story.agent)

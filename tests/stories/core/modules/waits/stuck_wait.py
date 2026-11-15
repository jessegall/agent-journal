
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES


def test_a_stuck_agent_is_told_nothing_and_its_stop_goes_through(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("wait stuck 'the build server is down'", actor=story.agent)
    story.expect_hook_silent("s-1", HookSamples.stop())

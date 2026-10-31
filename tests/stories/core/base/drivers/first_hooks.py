from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import SamplesChosen
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_sessions_first_hook_starts_its_agent_and_gives_its_drivers_opening_lines(new_story):
    story = new_story(SAMPLES, fixture=SamplesChosen)
    story.expect_hook_allowed("s-1", HookSamples.session_start(), "You are the sample lead")
    story.expect_success("agent show 1", "session: s-1", "role: main")


def test_a_subagents_first_hook_starts_a_subagent_row_under_its_agent(new_story):
    story = new_story(SAMPLES, fixture=SamplesChosen)
    story.hook("s-1", HookSamples.session_start())
    story.hook("s-1", {**HookSamples.stop(), "subagent": "sub-1"})
    story.expect_success("agent show 2", "role: subagent", "parent_id: 1")

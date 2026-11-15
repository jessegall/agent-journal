from engine.testing.examples.hook_samples import HookSamples
from tests.stories.engine.driver.support.fixtures import LeadLinesWaiting
from tests.stories.engine.driver.support.samples import SAMPLES
from tests.stories.support.story_checks import expect_value


def test_a_tool_hook_names_waiting_lines_in_order_and_marks_them_delivered(new_story):
    story = new_story(SAMPLES, fixture=LeadLinesWaiting)
    lines = story.hook("s-1", HookSamples.edit("src/cart.py")).lines
    expect_value("agent-lines 1, 2, 3, 4, 5" in lines, True)
    story.expect_text(f"agent-line list --agent {story.agent.id} --state delivered", "line 1", "line 5")

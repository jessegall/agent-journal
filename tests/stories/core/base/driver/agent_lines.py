from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadLinesWaiting
from tests.stories.core.base.driver.support.samples import SAMPLES


def test_a_tool_hook_names_waiting_lines_in_order_and_marks_them_delivered(new_story):
    story = new_story(SAMPLES, fixture=LeadLinesWaiting)
    lines = story.hook("s-1", HookSamples.edit("src/cart.py")).lines
    assert "agent-lines 1, 2, 3, 4, 5" in lines, lines
    story.expect_text(f"agent-line list --agent {story.agent.id} --state delivered", "line 1", "line 5")


def test_a_layer_that_delays_lines_gives_none_while_it_is_the_newest(new_story):
    story = new_story(SAMPLES, fixture=LeadLinesWaiting)
    story.run(f"edit-lock make {story.agent.id}")
    story.expect_rows(not any(line.startswith(("agent-line:", "agent-lines ")) for line in story.hook("s-1", HookSamples.stop()).lines))
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", "line 1", "line 5")

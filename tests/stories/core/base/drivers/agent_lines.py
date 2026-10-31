from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadLinesWaiting
from tests.stories.core.base.drivers.support.samples import SAMPLES


def test_a_tool_hook_gives_three_waiting_lines_in_order_and_keeps_the_rest_waiting(new_story):
    story = new_story(SAMPLES, fixture=LeadLinesWaiting)
    story.expect_rows(list(story.hook("s-1", HookSamples.edit("src/cart.py")).lines) == ["line 1", "line 2", "line 3"])
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", "line 4", "line 5")


def test_a_layer_that_delays_lines_gives_none_while_it_is_the_newest(new_story):
    story = new_story(SAMPLES, fixture=LeadLinesWaiting)
    story.run(f"edit-lock make {story.agent.id}")
    story.expect_rows(not any(line.startswith("line ") for line in story.hook("s-1", HookSamples.stop()).lines))
    story.expect_text(f"agent-line list --agent {story.agent.id} --state waiting", "line 1", "line 5")

from core.testing.hook_samples import HookSamples
from tests.stories.core.base.drivers.support.fixtures import LeadLocked, LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES


def lines_waiting(story, count: int) -> None:
    for number in range(1, count + 1):
        story.run(f'agent-line make 1 "line {number}"')


def test_a_tool_hook_gives_three_waiting_lines_in_order_and_keeps_the_rest_waiting(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    lines_waiting(story, 5)
    story.expect_rows(list(story.hook("s-1", HookSamples.edit("src/cart.py")).lines) == ["line 1", "line 2", "line 3"])
    story.expect_success("agent-line list --agent 1 --state waiting", "line 4", "line 5")


def test_a_layer_that_holds_lines_gives_none_while_it_is_the_newest(new_story):
    story = new_story(SAMPLES, fixture=LeadLocked)
    lines_waiting(story, 2)
    story.expect_rows(list(story.hook("s-1", HookSamples.prompt("go on")).lines) == [])
    story.expect_success("agent-line list --agent 1 --state waiting", "line 1", "line 2")

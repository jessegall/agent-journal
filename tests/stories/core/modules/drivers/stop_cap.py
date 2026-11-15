from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder

REFUSED_STOPS = 5


def test_a_main_agent_with_work_in_hand_is_refused_five_stops_in_a_row_then_the_user_is_asked_and_it_rests(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    continuation = HookSamples.stop().with_raw({"stop_hook_active": True})
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")
    for _ in range(REFUSED_STOPS - 2):
        story.expect_hook_refusal("s-1", continuation, "is in hand: continue")
    story.expect_hook_refusal("s-1", continuation, "was asked")
    story.expect_hook_allowed("s-1", continuation)

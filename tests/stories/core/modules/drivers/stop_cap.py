from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder

# Claude Code ends a turn after 8 stop refusals in a row unless its launch lifts the cap, which the journal does
STOPS_PAST_THE_CAP = 9


def test_a_main_agent_with_work_in_hand_is_refused_at_every_stop_past_the_programs_cap(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    continuation = HookSamples.stop().with_raw({"stop_hook_active": True})
    story.expect_hook_refusal("s-1", HookSamples.stop(), "is in hand: continue")
    for _ in range(STOPS_PAST_THE_CAP - 1):
        story.expect_hook_refusal("s-1", continuation, "is in hand: continue")

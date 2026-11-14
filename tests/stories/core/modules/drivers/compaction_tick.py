from engine.testing.examples.hook_samples import HookSamples
from core.modules.drivers.models.enums.compaction_state import CompactionState
from tests.stories.core.modules.drivers.context_compactions import compactions
from tests.stories.suites.coding.modules.workers.compaction_never_twice import expect_compaction_count
from tests.stories.suites.coding.modules.workers.context_limit import HARD, SESSION, LimitEnabled, has_context, typing_recorded

FULL_CONTEXT_ERROR = HookSamples.stop_failure("prompt is too long: 210000 tokens > 200000 maximum")
OVERLOAD_ERROR = HookSamples.stop_failure("overloaded_error")


def test_c10_a_stop_that_failed_on_a_full_context_asks_for_one_compaction_and_another_error_asks_for_none(new_story):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    story.hook(SESSION, OVERLOAD_ERROR)
    story.run_listeners()
    expect_compaction_count(story, 0)
    story.hook(SESSION, FULL_CONTEXT_ERROR)
    story.hook(SESSION, FULL_CONTEXT_ERROR)
    story.run_listeners()
    expect_compaction_count(story, 1)
    story.expect_rows([compaction.state for compaction in compactions(story)] == [CompactionState.REQUESTED], detail=str(compactions(story)))


def test_c13_a_tick_of_an_agent_past_both_limits_types_no_compaction(new_story):
    story = typing_recorded(new_story(fixture=LimitEnabled))
    has_context(story, HARD)
    story.tick(SESSION)
    story.run_listeners()
    expect_compaction_count(story, 0)
    story.expect_rows(compactions(story) == [], detail=str(compactions(story)))

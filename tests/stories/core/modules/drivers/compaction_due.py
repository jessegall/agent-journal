import pytest

from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_GROWTH_PERCENT, CONTEXT_LIMIT_TOKENS
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.suites.coding.modules.workers.compaction_never_twice import AutoCompacted, HardLimitEnabled, compacted, expect_compaction_count
from tests.stories.suites.coding.modules.workers.context_limit import HARD, LIMIT_TOKENS, SESSION, LimitEnabled, has_context, set_value, stops, typing_recorded

SMALL_CONTEXT = 100_000
LOWER_LIMIT = 250_000
TOKENS_OVER_LOWER_LIMIT = 300_000
TOKENS_OVER_LIMIT = LIMIT_TOKENS + 10_000
DEFAULT_GROWTH = LIMIT_TOKENS // 10
HALVED_GROWTH_PERCENT = 5
EDIT = HookSamples.edit("src/cart.py")


def reads_context(story, tokens):
    """The program reports a context size and the agent's next tool use lets the journal read it."""
    has_context(story, tokens)
    story.hook(SESSION, EDIT)


class ReducedCompaction(StoryFixture):
    """A compaction ended and the first context size read after it is far under the limit."""

    parent = AutoCompacted

    def steps(self, story):
        reads_context(story, SMALL_CONTEXT)


class UnreducedCompaction(StoryFixture):
    """A compaction ended and the first context size read after it is over the limit."""

    parent = AutoCompacted

    def steps(self, story):
        reads_context(story, TOKENS_OVER_LIMIT)


@pytest.fixture
def limited(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


@pytest.fixture
def reduced(new_story):
    return typing_recorded(new_story(fixture=ReducedCompaction))


@pytest.fixture
def unreduced(new_story):
    return typing_recorded(new_story(fixture=UnreducedCompaction))


def test_e1_e2_e3_a_context_that_fills_again_after_a_compaction_that_helped_is_compacted_at_the_limit_and_not_one_token_under(reduced):
    has_context(reduced, LIMIT_TOKENS - 1)
    stops(reduced)
    expect_compaction_count(reduced, 0)
    has_context(reduced, LIMIT_TOKENS)
    stops(reduced)
    expect_compaction_count(reduced, 1)
    compaction = reduced.run("context-compaction list --json", actor=reduced.user).output_text
    reduced.expect_rows(f'"tokens_after": {SMALL_CONTEXT}' in compaction, detail=compaction)


def test_e5_a_compaction_that_left_the_context_over_the_limit_is_followed_by_another_only_after_the_growth_share(unreduced):
    unreduced.expect_hook_allowed(SESSION, EDIT)
    has_context(unreduced, TOKENS_OVER_LIMIT + DEFAULT_GROWTH - 1)
    stops(unreduced)
    expect_compaction_count(unreduced, 0)
    has_context(unreduced, TOKENS_OVER_LIMIT + DEFAULT_GROWTH)
    stops(unreduced)
    expect_compaction_count(unreduced, 1)


def test_the_growth_share_is_a_setting_a_person_changes(unreduced):
    set_value(unreduced, CONTEXT_LIMIT_GROWTH_PERCENT, HALVED_GROWTH_PERCENT)
    has_context(unreduced, TOKENS_OVER_LIMIT + DEFAULT_GROWTH // 2)
    stops(unreduced)
    expect_compaction_count(unreduced, 1)


def test_e6_a_limit_a_person_lowers_types_nothing_by_itself_and_applies_to_the_next_stop(reduced):
    has_context(reduced, TOKENS_OVER_LOWER_LIMIT)
    set_value(reduced, CONTEXT_LIMIT_TOKENS, LOWER_LIMIT)
    reduced.run_listeners()
    expect_compaction_count(reduced, 0)
    stops(reduced)
    expect_compaction_count(reduced, 1)


def test_e7_with_the_limit_switched_off_nothing_is_due_and_switched_on_again_the_reading_decides(limited):
    set_value(limited, CONTEXT_LIMIT_ENABLED, "false")
    has_context(limited, LIMIT_TOKENS)
    stops(limited)
    expect_compaction_count(limited, 0)
    set_value(limited, CONTEXT_LIMIT_ENABLED, "true")
    stops(limited)
    expect_compaction_count(limited, 1)


def test_e9_a_context_that_passes_both_limits_between_two_readings_is_asked_to_compact_once(new_story):
    agent = typing_recorded(new_story(fixture=HardLimitEnabled))
    agent.hook(SESSION, HookSamples.prompt("fix the cart"))
    has_context(agent, HARD)
    agent.expect_hook_refusal(SESSION, EDIT, "no more tools, stop now")
    stops(agent)
    expect_compaction_count(agent, 1)
    compacted(agent, "manual")
    stops(agent)
    expect_compaction_count(agent, 1)

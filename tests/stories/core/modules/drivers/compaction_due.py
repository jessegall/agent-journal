import pytest

from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_GROWTH_PERCENT, CONTEXT_LIMIT_TOKENS
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.suites.coding.modules.workers.compaction_never_twice import AutoCompacted, HardLimitEnabled, compacted, expect_compaction_count
from tests.stories.suites.coding.modules.workers.context_limit import HARD, LIMIT_TOKENS, SESSION, LimitEnabled, has_context, set_value, stops, typing_recorded

SMALL_CONTEXT = 100_000
LOWER_LIMIT = 250_000
TOKENS_OVER_LOWER_LIMIT = 300_000
TOKENS_OVER_LIMIT = LIMIT_TOKENS + 10_000
DEFAULT_GROWTH = LIMIT_TOKENS // 10
HALVED_GROWTH_PERCENT = 5
EDIT = HookSamples.edit("src/cart.py")


@pytest.fixture
def limited(new_story):
    return typing_recorded(new_story(fixture=LimitEnabled))


@pytest.fixture
def compacted_agent(new_story):
    return typing_recorded(new_story(fixture=AutoCompacted))


def reads_context(story, tokens):
    """The program reports a context size and the agent's next tool use lets the journal read it."""
    has_context(story, tokens)
    story.hook(SESSION, EDIT)


def test_e1_a_context_that_fills_again_after_a_compaction_that_helped_is_compacted_once_more(compacted_agent):
    reads_context(compacted_agent, SMALL_CONTEXT)
    has_context(compacted_agent, LIMIT_TOKENS)
    stops(compacted_agent)
    expect_compaction_count(compacted_agent, 1)
    compaction = compacted_agent.run("context-compaction list --json", actor=compacted_agent.user).output_text
    compacted_agent.expect_rows(f'"tokens_after": {SMALL_CONTEXT}' in compaction, detail=compaction)


@pytest.mark.parametrize("tokens, compaction_count", [(LIMIT_TOKENS, 1), (LIMIT_TOKENS - 1, 0)], ids=["e2-at-the-limit", "e3-one-token-under"])
def test_a_reading_at_the_limit_is_due_and_one_token_under_is_not(limited, tokens, compaction_count):
    has_context(limited, tokens)
    stops(limited)
    expect_compaction_count(limited, compaction_count)


def test_e5_a_compaction_that_left_the_context_over_the_limit_is_followed_by_another_only_after_the_growth_share(compacted_agent):
    agent = compacted_agent
    reads_context(agent, TOKENS_OVER_LIMIT)
    stops(agent)
    has_context(agent, TOKENS_OVER_LIMIT + DEFAULT_GROWTH - 1)
    stops(agent)
    expect_compaction_count(agent, 0)
    has_context(agent, TOKENS_OVER_LIMIT + DEFAULT_GROWTH)
    stops(agent)
    expect_compaction_count(agent, 1)


def test_the_growth_share_is_a_setting_a_person_changes(compacted_agent):
    agent = compacted_agent
    set_value(agent, CONTEXT_LIMIT_GROWTH_PERCENT, HALVED_GROWTH_PERCENT)
    reads_context(agent, TOKENS_OVER_LIMIT)
    has_context(agent, TOKENS_OVER_LIMIT + DEFAULT_GROWTH // 2)
    stops(agent)
    expect_compaction_count(agent, 1)


def test_e6_a_limit_a_person_lowers_types_nothing_by_itself_and_applies_to_the_next_stop(compacted_agent):
    agent = compacted_agent
    reads_context(agent, SMALL_CONTEXT)
    has_context(agent, TOKENS_OVER_LOWER_LIMIT)
    set_value(agent, CONTEXT_LIMIT_TOKENS, LOWER_LIMIT)
    agent.run_listeners()
    expect_compaction_count(agent, 0)
    stops(agent)
    expect_compaction_count(agent, 1)


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

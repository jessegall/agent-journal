from datetime import timedelta

import pytest

from engine.testing.examples.hook_samples import HookSamples
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_TOKENS
from tests.stories.suites.coding.modules.workers.compaction_never_twice import AutoCompacted, STATUS_FILE_AGE, compacted, expect_compaction_count, modified_at_story_time
from tests.stories.suites.coding.modules.workers.context_limit import LIMIT_TOKENS, SESSION, LimitEnabled, has_context, set_value, stops, typing_recorded

TOKENS_OVER_LIMIT = LIMIT_TOKENS + 10_000
SMALLEST_LIMIT_TOKENS = 1
TOKENS_AT_START = 1_000
TOKENS_AFTER_COMPACTION = 500
TOKENS_AFTER_GROWTH = TOKENS_AFTER_COMPACTION + 1
LONG_WAIT = timedelta(seconds=601)
EDIT = HookSamples.edit("src/cart.py")


def reports_context_after_compaction(story, tokens):
    """The program rewrites its status file after the compaction ended, and the agent's next tool use lets the
    journal read it."""
    story.advance(STATUS_FILE_AGE)
    has_context(story, tokens)
    modified_at_story_time(story)
    story.hook(SESSION, EDIT)


def compaction_rows(story) -> str:
    return story.run("context-compaction list --json", actor=story.user).output_text


@pytest.mark.parametrize("tokens, state", [(TOKENS_OVER_LIMIT, "unreduced"), (LIMIT_TOKENS - 1, "measured")], ids=["b10-still-over-the-limit", "under-the-limit"])
def test_the_first_reading_after_a_compaction_moves_its_row_to_measured_or_to_unreduced_and_types_nothing(new_story, tokens, state):
    agent = typing_recorded(new_story(fixture=AutoCompacted))
    reports_context_after_compaction(agent, tokens)
    rows = compaction_rows(agent)
    agent.expect_rows(rows.count('"state"') == 1, f'"state": "{state}"' in rows, f'"tokens_after": {tokens}' in rows, detail=rows)
    agent.tick(SESSION)
    expect_compaction_count(agent, 0)


def test_j2_with_the_limit_at_one_token_an_agent_is_compacted_once_and_again_only_after_its_context_grows(new_story):
    agent = typing_recorded(new_story(fixture=LimitEnabled))
    set_value(agent, CONTEXT_LIMIT_TOKENS, SMALLEST_LIMIT_TOKENS)
    has_context(agent, TOKENS_AT_START)
    stops(agent)
    expect_compaction_count(agent, 1)
    compacted(agent, "manual")
    reports_context_after_compaction(agent, TOKENS_AFTER_COMPACTION)
    stops(agent)
    agent.advance(LONG_WAIT)
    stops(agent)
    expect_compaction_count(agent, 1)
    agent.expect_rows('"state": "unreduced"' in compaction_rows(agent), detail=compaction_rows(agent))
    agent.advance(STATUS_FILE_AGE)
    has_context(agent, TOKENS_AFTER_GROWTH)
    modified_at_story_time(agent)
    agent.advance(LONG_WAIT)
    stops(agent)
    expect_compaction_count(agent, 2)

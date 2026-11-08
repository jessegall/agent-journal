import json

import pytest

from core.modules.settings.support.context_share import CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.fixtures import UserJoined

USED_TOKENS = 248000
WINDOW_PERCENT = 20


def agent_row(story):
    rows = json.loads(story.run("usage show --environment main --json", actor=story.user).output_text)["agents"]
    return rows[0]


def reported(story, limit_on, limit_tokens):
    story.expect_success(f"setting set {CONTEXT_LIMIT_ON} {limit_on} --project", actor=story.user)
    story.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} {limit_tokens} --project", actor=story.user)
    save_status_file(story, "s-1", {"context_window": {"used_percentage": WINDOW_PERCENT, "total_input_tokens": USED_TOKENS}})
    return agent_row(story)


def test_a_limit_that_comes_before_the_window_is_the_limit_the_usage_read_gives(new_story):
    row = reported(new_story(fixture=UserJoined), "true", 400000)
    assert (row["context_percent"], row["context_tokens"], row["context_limit_tokens"]) == (62, USED_TOKENS, 400000), row


@pytest.mark.parametrize("limit_on, limit_tokens", [("false", 400000), ("true", 2000000)], ids=["limit off", "window smaller than the limit"])
def test_with_no_limit_on_or_a_smaller_window_the_usage_read_gives_no_limit(new_story, limit_on, limit_tokens):
    row = reported(new_story(fixture=UserJoined), limit_on, limit_tokens)
    assert row["context_limit_tokens"] is None, row
    assert row["context_tokens"] == USED_TOKENS, row

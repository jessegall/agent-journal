import json
import os

from engine.journal.journal_home import JournalHome
from core.modules.agents.models.agent import Agent
from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_CATEGORIES, CONTEXT_LIMIT_TOKENS, ContextShare
from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_value

USED_TOKENS = 248000
WINDOW_PERCENT = 20


def agent_row(story):
    rows = json.loads(story.run("usage show --environment main --json", actor=story.user).output_text)["agents"]
    return rows[0]


def reported(story, limit_enabled, limit_tokens):
    story.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} {limit_enabled} --project", actor=story.user)
    story.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} {limit_tokens} --project", actor=story.user)
    save_status_file(story, "s-1", {"context_window": {"used_percentage": WINDOW_PERCENT, "total_input_tokens": USED_TOKENS}})
    return agent_row(story)


def test_a_limit_that_comes_before_the_window_is_the_limit_the_usage_read_gives(new_story):
    row = reported(new_story(fixture=UserJoined), "true", 400000)
    expect_value((row["context_percent"], row["context_tokens"], row["context_limit_tokens"]), (62, USED_TOKENS, 400000))





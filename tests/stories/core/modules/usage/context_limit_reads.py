import json
import os

import pytest

from core.base.journal_home import JournalHome
from core.modules.settings.bindings.support.context_share import CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS, ContextShare
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


@pytest.mark.parametrize("limit_enabled, limit_tokens", [("false", 400000), ("true", 2000000)], ids=["limit off", "window smaller than the limit"])
def test_with_no_limit_on_or_a_smaller_window_the_usage_read_gives_no_limit(new_story, limit_enabled, limit_tokens):
    row = reported(new_story(fixture=UserJoined), limit_enabled, limit_tokens)
    expect_value(row["context_limit_tokens"] is None, True)
    expect_value(row["context_tokens"], USED_TOKENS)


def test_a_status_file_in_the_shape_the_launcher_writes_for_a_headless_agent_gives_its_tokens_to_the_usage_read(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {CONTEXT_LIMIT_TOKENS} 400000 --project", actor=story.user)
    story.expect_success(f"setting set {CONTEXT_LIMIT_ENABLED} true --project", actor=story.user)
    save_status_file(story, "s-1", {"session_id": "s-1", "context_window": {"used_percentage": 20, "total_input_tokens": 200100}, "cost": {"total_cost_usd": 1.5}})
    row = agent_row(story)
    expect_value((row["context_tokens"], row["context_limit_tokens"], row["cost_dollars"]), (200100, 400000, 1.5))


def test_a_status_file_that_changes_during_a_hook_is_read_once_and_gives_both_numbers_from_that_read(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    save_status_file(story, "s-1", {"context_window": {"used_percentage": WINDOW_PERCENT, "total_input_tokens": USED_TOKENS}})
    path = story.home.status_file("s-1")
    modified = path.stat().st_mtime_ns
    original = JournalHome.status_file
    requested = []

    def status_file_race(home, session):
        requested.append(session)
        matched = original(home, session)
        if len(requested) > 1:
            matched.write_text(json.dumps({"context_window": {"used_percentage": 90, "total_input_tokens": 1_000_000_000}}))
            os.utime(matched, ns=(modified, modified))
        return matched

    monkeypatch.setattr(JournalHome, "status_file", status_file_race)
    with story.repeated_work.request():
        usage = story.container.get(ContextShare).usage("claude", "s-1")
    expect_value((usage.percent, usage.used_tokens), (WINDOW_PERCENT, USED_TOKENS))
    expect_value(len(requested), 1)

import json
import os

from engine.journal.journal_home import JournalHome
from engine.query.queries import Queries
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
        usage = story.container.get(ContextShare).usage_within("claude", "s-1", None)
    expect_value((usage.percent, usage.used_tokens), (WINDOW_PERCENT, USED_TOKENS))
    expect_value(len(requested), 1)


def test_the_card_and_every_other_read_give_the_percent_of_the_agents_own_cap(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting set {CONTEXT_LIMIT_CATEGORIES} main:300000 --project", actor=story.user)
    row = reported(story, "true", 400000)
    agent = story.container.get(Queries).query(Agent).first()
    expect_value((agent.role, row["context_percent"], story.container.get(ContextShare).percent_of(agent)), ("main", 82, 82))

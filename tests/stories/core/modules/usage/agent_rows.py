import json
from datetime import timedelta

from tests.stories.core.support.coding_fixtures import BuilderWithUser


def test_agent_rows_keep_creation_order_when_states_and_activity_change(new_story):
    story = new_story(fixture=BuilderWithUser)
    oldest = story.new_row_id("agent start oldest claude subagent --environment main")
    story.advance(timedelta(seconds=1))
    middle = story.new_row_id("agent start middle codex worker --environment main")
    story.advance(timedelta(seconds=1))
    newest = story.new_row_id("agent start newest claude reviewer --environment main")
    story.run(f"agent end {middle}")
    story.run(f"agent edit {oldest} --paused-at {story.clock.timestamp().text}")
    rows = json.loads(story.run("agent cards --environment main --helpers --show all --json", actor=story.user).output_text)["rows"]
    assert [row["id"] for row in rows] == [oldest, middle, newest]
    assert [row["id"] for row in json.loads(story.run("agent cards --environment main --helpers --show running --json", actor=story.user).output_text)["rows"]] == [oldest, newest]


def test_agent_rows_filter_search_and_page_before_answering(new_story):
    story = new_story(fixture=BuilderWithUser)
    for session in ("first", "second", "third"):
        story.run(f"agent start {session} claude subagent --environment main")
        story.advance(timedelta(seconds=1))
    rows = json.loads(story.run("agent cards --environment main --helpers --show all --limit 1 --page 2 --json", actor=story.user).output_text)["rows"]
    assert [row["session"] for row in rows] == ["second"]
    matching_rows = json.loads(story.run("agent cards --environment main --helpers --search third --json", actor=story.user).output_text)["rows"]
    assert [row["session"] for row in matching_rows] == ["third"]

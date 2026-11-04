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
    outcome = story.run("agent cards --environment main --helpers --show all --json", actor=story.user)
    assert outcome.code == 0, outcome.output_text
    rows = json.loads(outcome.output_text)["rows"]
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


def test_agent_filters_include_main_agents_and_finished_helpers(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal" / "helper-session.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text(json.dumps({"type": "assistant", "message": {"content": "The review is complete"}}) + "\n")
    story = new_story(fixture=BuilderWithUser)
    main = story.new_row_id("agent start main-session claude main --environment main")
    helper = story.new_row_id("agent start helper-session claude subagent --environment main")
    reviewer = story.new_row_id("agent start review-session claude reviewer --environment main")
    worker = story.new_row_id("agent start worker-session codex worker --environment main")
    running_helper = story.new_row_id("agent start running-helper claude subagent --environment main")
    running_worker = story.new_row_id("agent start running-worker codex worker --environment main")
    retired_main = story.new_row_id("agent start retired-main claude main --environment main")
    story.run(f"agent end {helper}")
    story.run(f"agent end {reviewer}")
    story.run(f"agent end {worker}")
    story.run(f"agent end {retired_main}")
    rows = lambda state: json.loads(story.run(f"agent cards --environment main --show {state} --json", actor=story.user).output_text)["rows"]
    assert {main, running_helper, running_worker} <= {row["id"] for row in rows("running")}
    assert {helper, reviewer} <= {row["id"] for row in rows("idle")}
    assert {worker, retired_main} <= {row["id"] for row in rows("retired")}
    assert {main, helper, reviewer, worker, running_helper, running_worker, retired_main} <= {row["id"] for row in rows("all")}
    states = {row["id"]: row["state"] for row in rows("all")}
    assert states[main] == "running"
    assert states[helper] == "idle"
    assert states[worker] == "retired"
    story.expect_text(f"agent transcript {helper}", "The review is complete", actor=story.user)

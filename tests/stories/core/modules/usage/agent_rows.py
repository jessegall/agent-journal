import pytest
import json
from datetime import timedelta

from tests.stories.core.support.coding_fixtures import BuilderWithUser


def cards(story, state: str) -> list[dict[str, object]]:
    return json.loads(story.run(f"agent cards --environment main --show {state} --json", actor=story.user).output_text)["rows"]


def expect_card_order(story, state: str, *agent_ids: int) -> None:
    listed = [row["id"] for row in cards(story, state)]
    assert listed == list(agent_ids), listed


def expect_listed(story, state: str, *agent_ids: int) -> None:
    listed = {row["id"] for row in cards(story, state)}
    assert set(agent_ids) <= listed, listed


def expect_unlisted(story, *agent_ids: int) -> None:
    listed = {row["id"] for row in cards(story, "all")}
    assert not set(agent_ids) & listed, listed


def test_agent_rows_keep_creation_order_when_states_and_activity_change(new_story):
    story = new_story(fixture=BuilderWithUser)
    oldest = story.new_row_id("agent start oldest claude helper --environment main")
    story.advance(timedelta(seconds=1))
    middle = story.new_row_id("agent start middle codex worker --environment main")
    story.advance(timedelta(seconds=1))
    newest = story.new_row_id("agent start newest claude reviewer --environment main")
    story.run(f"agent end {middle}")
    story.run(f"agent edit {oldest} --paused-at {story.clock.timestamp().text}")
    expect_card_order(story, "all", oldest, middle, newest)
    expect_card_order(story, "running", oldest, newest)


def test_agent_rows_filter_search_and_page_before_answering(new_story):
    story = new_story(fixture=BuilderWithUser)
    for session in ("first", "second", "third"):
        story.run(f"agent start {session} claude helper --environment main")
        story.advance(timedelta(seconds=1))
    rows = json.loads(story.run("agent cards --environment main --show all --limit 1 --page 2 --json", actor=story.user).output_text)["rows"]
    expect_session_matching(rows, ["second"])
    matching_rows = json.loads(story.run("agent cards --environment main --search third --json", actor=story.user).output_text)["rows"]
    expect_session_matching(matching_rows, ["third"])


def test_agent_filters_leave_out_main_agents_and_include_finished_helpers(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal" / "helper-session.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text(json.dumps({"type": "assistant", "message": {"content": "The review is complete"}}) + "\n")
    story = new_story(fixture=BuilderWithUser)
    main = story.new_row_id("agent start main-session claude main --environment main")
    helper = story.new_row_id("agent start helper-session claude helper --environment main")
    reviewer = story.new_row_id("agent start review-session claude reviewer --environment main")
    worker = story.new_row_id("agent start worker-session codex worker --environment main")
    running_helper = story.new_row_id("agent start running-helper claude helper --environment main")
    running_worker = story.new_row_id("agent start running-worker codex worker --environment main")
    retired_main = story.new_row_id("agent start retired-main claude main --environment main")
    story.run(f"agent end {helper}")
    story.run(f"agent end {reviewer}")
    story.run(f"agent end {worker}")
    story.run(f"agent end {retired_main}")
    expect_listed(story, "running", running_helper, running_worker)
    expect_listed(story, "idle", helper, reviewer)
    expect_listed(story, "retired", worker)
    expect_listed(story, "all", helper, reviewer, worker, running_helper, running_worker)
    expect_unlisted(story, main, retired_main)
    states = {row["id"]: row["state"] for row in cards(story, "all")}
    expect_states_2(states, helper, "idle")
    expect_states_2(states, worker, "retired")
    story.expect_text(f"agent transcript {helper}", "The review is complete", actor=story.user)


def expect_states_2(states, worker, expected) -> None:
    actual = states[worker]
    assert actual == expected, actual


def expect_session_matching(matching_rows, expected) -> None:
    actual = [row['session'] for row in matching_rows]
    assert actual == expected, actual


@pytest.mark.parametrize(("role", "job_enabled"), [("worker", True), ("main", False), ("helper", False)])
def test_the_suite_selects_which_agent_cards_show_their_job(new_story, role, job_enabled):
    story = new_story(fixture=BuilderWithUser)
    agent_id = story.new_row_id(f"agent start policy-session codex {role} --environment main")
    rows = json.loads(story.run("usage agents --environment main --json", actor=story.user).output_text)["rows"]
    facts = next(row for row in rows if row["id"] == agent_id)
    story.expect_rows(facts["job_enabled"] is job_enabled)


def test_agent_card_filters_combine_before_paging(new_story):
    story = new_story(fixture=BuilderWithUser)
    worker = story.new_row_id("agent start filter-worker codex worker --environment main")
    story.new_row_id("agent start filter-helper claude helper --environment main")
    rows = json.loads(story.run("agent cards --environment main --show all --role worker --program codex --limit 1 --json", actor=story.user).output_text)
    story.expect_rows([row["id"] for row in rows["rows"]] == [worker], rows["total"] == 1)
    options = json.loads(story.run("agent cards --options --environment main --json", actor=story.user).output_text)
    story.expect_rows("worker" in options["roles"], "helper" in options["roles"])
    main = json.loads(story.run("agent cards --include-main --role main --show all --environment main --json", actor=story.user).output_text)
    story.expect_rows(any(row["id"] == story.agent.id for row in main["rows"]))

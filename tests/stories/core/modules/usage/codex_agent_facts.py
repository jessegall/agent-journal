import json

from tests.stories.core.support.coding_fixtures import BuilderWithUser


def test_a_codex_agent_shows_the_model_its_rollout_ran_and_no_cost_where_codex_reports_none(new_story, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
    monkeypatch.setenv("CODEX_HOME", str(story.home.folder / "codex"))
    worker_id = story.new_row_id("agent start codex-model codex worker --environment main")
    rollout = story.home.folder / "codex" / "sessions" / "rollout-test-codex-model.jsonl"
    rollout.parent.mkdir(parents=True)
    rollout.write_text(json.dumps({"type": "turn_context", "payload": {"model": "gpt-6.1-sol", "effort": "medium"}}) + "\n")
    facts = json.loads(story.run("usage agents --environment main --json").output_text)["rows"]
    row = next(row for row in facts if row["id"] == worker_id)
    story.expect_rows(row["model"] == "gpt-6.1-sol" and row["cost_dollars"] is None)
    story.expect_text("usage show --environment main", f"agent {worker_id}  codex-model  codex  nothing reported yet", actor=story.user)


def test_a_codex_agent_shows_the_context_its_rollout_last_counted(new_story, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
    monkeypatch.setenv("CODEX_HOME", str(story.home.folder / "codex"))
    worker_id = story.new_row_id("agent start codex-context codex worker --environment main")
    rollout = story.home.folder / "codex" / "sessions" / "2026" / "11" / "06" / "rollout-2026-11-06T18-31-51-codex-context.jsonl"
    rollout.parent.mkdir(parents=True)
    count = {"type": "event_msg", "payload": {"type": "token_count", "info": {"last_token_usage": {"input_tokens": 150000, "total_tokens": 150390}, "model_context_window": 475000}}}
    rollout.write_text(json.dumps(count) + "\n")
    facts = json.loads(story.run("usage agents --environment main --json").output_text)["rows"]
    row = next(row for row in facts if row["id"] == worker_id)
    story.expect_rows(row["context_percent"] == 31, row["cost_dollars"] is None)


def test_the_skills_of_an_agent_list_with_their_count_and_a_state_filter(new_story):
    story = new_story(fixture=BuilderWithUser)
    worker_id = story.new_row_id("agent start skill-count codex worker --environment main")
    listing = json.loads(story.run(f"agent-skill list --agent {worker_id} --state loaded --limit 1 --columns id --json").output_text)
    story.expect_rows(listing["total"] == 0 and listing["rows"] == [])

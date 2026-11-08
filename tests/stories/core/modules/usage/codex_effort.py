import json

from tests.stories.core.support.coding_fixtures import BuilderWithUser


def test_codex_effort_stays_on_the_card_when_a_turn_grows_past_the_transcript_tail(new_story, monkeypatch):
    story = new_story(fixture=BuilderWithUser)
    monkeypatch.setenv("CODEX_HOME", str(story.home.folder / "codex"))
    worker_id = story.new_row_id("agent start codex-effort codex worker --environment main")
    rollout = story.home.folder / "codex" / "sessions" / "2026" / "11" / "06" / "rollout-2026-11-06T18-31-51-codex-effort.jsonl"
    rollout.parent.mkdir(parents=True)
    rollout.write_text(json.dumps({"type": "turn_context", "payload": {"effort": "high"}}) + "\n")
    facts = json.loads(story.run("usage agents --environment main --json").output_text)["rows"]
    story.expect_rows(next(row for row in facts if row["id"] == worker_id)["effort"] == "high")
    with rollout.open("a") as stream:
        stream.write((json.dumps({"type": "event_msg", "payload": {"text": "x" * 1000}}) + "\n") * 300)
    facts = json.loads(story.run("usage agents --environment main --json").output_text)["rows"]
    story.expect_rows(next(row for row in facts if row["id"] == worker_id)["effort"] == "high")
    with rollout.open("a") as stream:
        stream.write(json.dumps({"type": "turn_context", "payload": {"effort": "medium"}}) + "\n")
    facts = json.loads(story.run("usage agents --environment main --json").output_text)["rows"]
    story.expect_rows(next(row for row in facts if row["id"] == worker_id)["effort"] == "medium")

import json

from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import MainEnvironment


def test_a_claude_agents_transcript_is_read_from_its_session_file(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal" / "s-1.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text("\n".join(json.dumps(row) for row in [{"type": "user", "message": {"content": "Fix the cart total"}},
                                                                 {"type": "assistant", "message": {"content": [{"type": "text", "text": "The total is in cents now"}]}},
                                                                 {"type": "summary", "summary": "skipped"}]) + "\n")
    story = new_story(fixture=MainEnvironment)
    agent_id = story.new_row_id(lines.AGENT_START)
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  Fix the cart total", "2  assistant  assistant  The total is in cents now")


def test_a_workers_transcript_is_found_under_its_worktrees_folder(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal--journal-worktrees-main-worker-7" / "s-1.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text(json.dumps({"type": "user", "message": {"content": "Fix the cart total"}}) + "\n")
    story = new_story(fixture=MainEnvironment)
    agent_id = story.new_row_id(lines.AGENT_START)
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  Fix the cart total")


def test_a_user_row_from_the_journal_or_a_monitor_carries_its_own_tag(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal" / "s-1.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text("\n".join(json.dumps({"type": "user", "message": {"content": text}}) for text in ["Stop hook feedback: carry on", "<task-notification>ended</task-notification>", "Fix it"]) + "\n")
    story = new_story(fixture=MainEnvironment)
    agent_id = story.new_row_id(lines.AGENT_START)
    story.expect_success(f"agent transcript {agent_id}", "1  journal  user  Stop hook feedback: carry on", "2  monitor  user  <task-notification>ended</task-notification>", "3  user  user  Fix it")


def test_a_codex_agents_transcript_is_read_from_its_rollout(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex"))
    rollout = tmp_path / "codex" / "sessions" / "2026" / "10" / "31" / "rollout-2026-10-31T09-00-00-t-1.jsonl"
    rollout.parent.mkdir(parents=True)
    rollout.write_text(json.dumps({"type": "response_item", "payload": {"role": "user", "content": [{"type": "input_text", "text": "Write the tests"}]}}) + "\n")
    story = new_story(fixture=MainEnvironment)
    agent_id = story.new_row_id("agent start t-1 codex main --environment main")
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  Write the tests")


def test_an_agent_with_no_transcript_yet_shows_nothing_found(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    story = new_story(fixture=MainEnvironment)
    agent_id = story.new_row_id(lines.AGENT_START)
    story.expect_success(f"agent transcript {agent_id}", "nothing found")

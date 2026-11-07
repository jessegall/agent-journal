import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.testing.story_fixture import StoryFixture

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
    story = new_story(fixture=ClaudeTranscriptAgent)
    agent_id = story.agent.id
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  Fix the cart total", "2  assistant  assistant  The total is in cents now")


def test_a_workers_transcript_is_found_under_its_worktrees_folder(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal--journal-worktrees-main-worker-7" / "s-1.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text(json.dumps({"type": "user", "message": {"content": "Fix the cart total"}}) + "\n")
    story = new_story(fixture=ClaudeTranscriptAgent)
    agent_id = story.agent.id
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  Fix the cart total")


def test_a_user_row_from_the_journal_or_a_monitor_carries_its_own_tag(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal" / "s-1.jsonl"
    transcript.parent.mkdir(parents=True)
    transcript.write_text("\n".join(json.dumps({"type": "user", "message": {"content": text}}) for text in ["Stop hook feedback: carry on", "<task-notification>ended</task-notification>", "Fix it"]) + "\n")
    story = new_story(fixture=ClaudeTranscriptAgent)
    agent_id = story.agent.id
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
    story = new_story(fixture=ClaudeTranscriptAgent)
    agent_id = story.agent.id
    story.expect_success(f"agent transcript {agent_id}", "nothing found")


def user_lines(*numbers):
    return "".join(json.dumps({"type": "user", "message": {"content": f"line {number}"}}) + "\n" for number in numbers)


def transcript_file(tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal" / "s-1.jsonl"
    transcript.parent.mkdir(parents=True)
    return transcript


def test_a_transcripts_pages_and_total_stay_right_when_the_file_grows(new_story, tmp_path, monkeypatch):
    transcript = transcript_file(tmp_path, monkeypatch)
    transcript.write_text(user_lines(1, 2, 3))
    story = new_story(fixture=ClaudeTranscriptAgent)
    agent_id = story.agent.id
    story.expect_success(f"agent transcript {agent_id} --limit 2", "2  user  user  line 2", "3  user  user  line 3", "page 1, 2 of 3 rows: --page 2 for the next")
    with transcript.open("a") as grown:
        grown.write(user_lines(4, 5))
    story.expect_success(f"agent transcript {agent_id} --limit 2", "4  user  user  line 4", "5  user  user  line 5", "page 1, 2 of 5 rows: --page 2 for the next")
    story.expect_success(f"agent transcript {agent_id} --limit 2 --page 3", "1  user  user  line 1")
    story.expect_absent(f"agent transcript {agent_id} --limit 2 --page 3", "2  user  user  line 2", "page 3, 1 of 5 rows: --page 4 for the next")


def test_a_row_without_text_between_the_rows_takes_no_position(transcript_with_empty_rows):
    transcript, story, agent_id = transcript_with_empty_rows
    with transcript.open("a") as grown:
        grown.write(json.dumps({"type": "summary", "summary": "skipped"}) + "\n" + user_lines(3))
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  line 1", "2  user  user  line 2", "3  user  user  line 3")


def test_a_transcript_that_shrank_is_read_from_its_start_again(readable_transcript):
    transcript, story, agent_id = readable_transcript
    transcript.write_text(user_lines(7))
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  line 7")
    story.expect_absent(f"agent transcript {agent_id}", "2  user  user  line 2", "3  user  user  line 3")


def test_a_line_still_being_written_is_read_once_it_ends(partial_transcript):
    transcript, complete_line, story, agent_id = partial_transcript
    transcript.write_text(user_lines(1) + complete_line)
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  line 1", "2  user  user  line 2")


class ClaudeTranscriptAgent(StoryFixture):
    parent = MainEnvironment

    def steps(self, story):
        story.agent = Actor(story.new_row_id(lines.AGENT_START), ActorType.AGENT)


@pytest.fixture
def partial_transcript(new_story, tmp_path, monkeypatch):
    transcript = transcript_file(tmp_path, monkeypatch)
    complete_line = user_lines(2)
    transcript.write_text(user_lines(1) + complete_line[:10])
    story = new_story(fixture=ClaudeTranscriptAgent)
    agent_id = story.agent.id
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  line 1")
    return transcript, complete_line, story, agent_id


@pytest.fixture
def transcript_with_empty_rows(new_story, tmp_path, monkeypatch):
    transcript = transcript_file(tmp_path, monkeypatch)
    transcript.write_text(user_lines(1) + json.dumps({"type": "summary", "summary": "skipped"}) + "\n\n" + user_lines(2))
    story = new_story(fixture=ClaudeTranscriptAgent)
    agent_id = story.agent.id
    story.expect_success(f"agent transcript {agent_id}", "1  user  user  line 1", "2  user  user  line 2")
    return transcript, story, agent_id


@pytest.fixture
def readable_transcript(new_story, tmp_path, monkeypatch):
    transcript = transcript_file(tmp_path, monkeypatch)
    transcript.write_text(user_lines(1, 2, 3))
    story = new_story(fixture=ClaudeTranscriptAgent)
    agent_id = story.agent.id
    story.expect_success(f"agent transcript {agent_id}", "3  user  user  line 3")
    return transcript, story, agent_id

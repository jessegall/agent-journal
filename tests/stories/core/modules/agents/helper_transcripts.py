from tests.stories.core.support.agent_labels import agent_number
from engine.enums.actor_type import ActorType
from engine.testing.stories.story_fixture import StoryFixture

import json

from engine.actor.actor import Actor
from engine.command.context import Context
from engine.database.database import READ_LIMIT_ROWS, Database
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.messages.commands.read_message.read_message import ReadMessage
from tests.stories.core.modules.usage.usage import HELPER_START
from tests.stories.core.support.coding_fixtures import BuilderStarted

FIXED_TIME = "2026-11-03T05:00:00.000Z"


def row(row_type: str, text: str, at: str = FIXED_TIME) -> dict[str, object]:
    return {"type": row_type, "timestamp": at, "message": {"content": text}}


def read_transcript(tmp_path, monkeypatch, session: str, *rows) -> None:
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path / "claude"))
    transcript = tmp_path / "claude" / "projects" / "-work-journal" / f"{session}.jsonl"
    transcript.parent.mkdir(parents=True, exist_ok=True)
    transcript.write_text("".join(json.dumps(item) + "\n" for item in rows))


def read_worker(story) -> int:
    return story.new_row_id(HELPER_START.format(parent=story.agent.id))


def deliver_line(story, agent_id: int, creator_id: int, text: str) -> None:
    with story.container.get(Database).transaction():
        story.container.get(Repository).save(AgentLine(session_agent_id=agent_id, creator_id=creator_id, text=text), Context(Actor.core(), story.clock.timestamp(), ReadMessage(1)))


def test_a_workers_own_rows_say_worker_and_not_assistant(new_story, tmp_path, monkeypatch):
    read_transcript(tmp_path, monkeypatch, "s-2", row("assistant", "The cart is fixed"))
    story = new_story(fixture=TranscriptWorker)
    story.expect_text(f"agent transcript {agent_number(story, story.helper.id)}", "1  worker  assistant  The cart is fixed")


def test_a_row_the_journal_sent_a_worker_is_tagged_journal_and_one_the_main_agent_sent_is_tagged_main_agent(new_story, tmp_path, monkeypatch):
    read_transcript(tmp_path, monkeypatch, "s-2", row("user", "Your tests failed: two"), row("user", "Fix the footer too"))
    story = new_story(fixture=TranscriptWorker)
    worker = story.helper.id
    deliver_line(story, worker, 1, "Your tests failed: two")
    deliver_line(story, worker, story.agent.id, "Fix the footer too")
    story.expect_text(f"agent transcript {agent_number(story, worker)}", "1  journal  user  Your tests failed: two", "2  main agent  user  Fix the footer too")


def test_the_transcript_of_a_worker_with_more_lines_than_one_read_may_load_still_names_who_sent_a_row(new_story, tmp_path, monkeypatch):
    read_transcript(tmp_path, monkeypatch, "s-2", row("user", "Fix the footer too"))
    story = new_story(fixture=TranscriptWorker)
    worker = story.helper.id
    for number in range(READ_LIMIT_ROWS):
        deliver_line(story, worker, 1, f"Your tests failed: {number}")
    deliver_line(story, worker, story.agent.id, "Fix the footer too")
    database = story.container.get(Database)
    database.read_limit_rows, database.collected_large_reads = READ_LIMIT_ROWS, None
    story.expect_text(f"agent transcript {agent_number(story, worker)}", "1  main agent  user  Fix the footer too")
    story.expect_rows(not database.collected_large_reads, detail=str(database.collected_large_reads))


def test_a_row_of_a_worker_that_no_line_matches_is_tagged_journal_and_never_user(new_story, tmp_path, monkeypatch):
    read_transcript(tmp_path, monkeypatch, "s-2", row("user", "Tell me what to do"))
    story = new_story(fixture=TranscriptWorker)
    story.expect_text(f"agent transcript {agent_number(story, story.helper.id)}", "1  journal  user  Tell me what to do")


def test_a_row_is_matched_to_a_line_by_the_text_it_holds_not_by_how_it_opens(new_story, tmp_path, monkeypatch):
    read_transcript(tmp_path, monkeypatch, "s-2", row("user", "[journal] your next task"), row("user", "[journal] look at the cart"))
    story = new_story(fixture=TranscriptWorker)
    worker = story.helper.id
    deliver_line(story, worker, story.agent.id, "[journal] look at the cart")
    story.expect_text(f"agent transcript {agent_number(story, worker)}", "1  journal  user  [journal] your next task", "2  main agent  user  [journal] look at the cart")


def test_a_monitor_event_in_a_workers_transcript_stays_a_monitor_row(new_story, tmp_path, monkeypatch):
    read_transcript(tmp_path, monkeypatch, "s-2", row("user", "<task-notification>ended</task-notification>"))
    story = new_story(fixture=TranscriptWorker)
    story.expect_text(f"agent transcript {agent_number(story, story.helper.id)}", "1  monitor  user  <task-notification>ended</task-notification>")


def test_the_main_agents_rows_keep_user_and_assistant(new_story, tmp_path, monkeypatch):
    read_transcript(tmp_path, monkeypatch, "s-1", row("user", "Fix the cart"), row("assistant", "Done"))
    story = new_story(fixture=BuilderStarted)
    story.expect_text(f"agent transcript {agent_number(story, story.agent.id)}", "1  user  user  Fix the cart", "2  assistant  assistant  Done")


def test_each_row_carries_its_time_from_the_session_file(new_story, tmp_path, monkeypatch):
    read_transcript(tmp_path, monkeypatch, "s-1", row("user", "Fix the cart", "2026-11-03T05:00:01.000Z"), row("assistant", "Done", "2026-11-03T05:00:09.000Z"))
    story = new_story(fixture=BuilderStarted)
    story.expect_text(f"agent transcript {agent_number(story, story.agent.id)} --json", '"time": "2026-11-03T05:00:01.000Z"', '"time": "2026-11-03T05:00:09.000Z"')


def test_a_codex_row_carries_its_time_too(new_story, tmp_path, monkeypatch):
    monkeypatch.setenv("CODEX_HOME", str(tmp_path / "codex"))
    rollout = tmp_path / "codex" / "sessions" / "2026" / "11" / "03" / "rollout-2026-11-03T05-00-00-t-1.jsonl"
    rollout.parent.mkdir(parents=True)
    rollout.write_text(json.dumps({"timestamp": FIXED_TIME, "type": "response_item", "payload": {"role": "user", "content": [{"type": "input_text", "text": "Write the tests"}]}}) + "\n")
    story = new_story(fixture=BuilderStarted)
    codex = story.new_row_id("agent start t-1 codex main --environment main")
    story.expect_text(f"agent transcript {agent_number(story, codex)} --json", f'"time": "{FIXED_TIME}"')


class TranscriptWorker(StoryFixture):
    parent = BuilderStarted

    def steps(self, story):
        story.helper = Actor(read_worker(story), ActorType.AGENT)

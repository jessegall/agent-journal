import json
import sqlite3
from datetime import timedelta
from pathlib import Path
from threading import Event

import pytest

from core.base.provider.transcript_entries import TranscriptEntries
from core.base.database.database import BUSY_TIMEOUT_SECONDS, Database
from core.modules.messages.support.message_nudges import CLOSING_LINE_HIDDEN
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.server.support.server_client import server_story
from server.endpoints.hook_endpoint import HookEndpoint
from server.hook.hook_delivery_retries import HookDeliveryRetries
from server.hook.queue_priority import QueuePriority

AGENT_TEXT = "Loading the nudge records takes 10.5 seconds, so I am reading the query code now."
TOOL_FINISHED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
HOOK_DELAY = timedelta(seconds=30)
RETRY_BUSY_SECONDS = 0.05


def agent_row(story, text: str, age: timedelta = timedelta()) -> dict[str, object]:
    return {"type": "assistant", "timestamp": entry_timestamp(story, age), "message": {"role": "assistant", "content": [{"type": "text", "text": text}]}}


def prompt_row(story, text: str, **fields: object) -> dict[str, object]:
    return {"type": "user", "promptSource": "typed", "timestamp": entry_timestamp(story, timedelta()), "message": {"role": "user", "content": text}, **fields}


def codex_row(story, role: str, text: str) -> dict[str, object]:
    block = {"type": "output_text" if role == "assistant" else "input_text", "text": text}
    return {"type": "response_item", "timestamp": entry_timestamp(story, timedelta()), "payload": {"type": "message", "role": role, "content": [block]}}


def entry_timestamp(story, age: timedelta) -> str:
    return (story.clock.timestamp().value - age).isoformat()


def transcript(tmp_path, *rows: dict[str, object]) -> str:
    path = tmp_path / "session.jsonl"
    with path.open("a") as file:
        file.write("".join(json.dumps(row) + "\n" for row in rows))
    return str(path)


def run_hook(story, path: str, sample=None) -> None:
    story.advance(HOOK_DELAY)
    story.hook("s-1", (sample or HookSamples.prompt("go on")).with_raw({"transcript_path": path}))


def chat(story) -> str:
    return story.run("message list --environment main", actor=story.user).output_text


def expect_chat_count(story, text: str, expected: int) -> None:
    output = chat(story)
    story.expect_rows(output.count(text) == expected, detail=output[:400])


@pytest.fixture
def builder(new_story):
    return new_story(fixture=UserBuilder)


@pytest.fixture
def reply_story(builder):
    builder.run('message send "are you there" --environment main', actor=builder.user)
    builder.hook("s-1", HookSamples.prompt("go on"))
    builder.advance(HOOK_DELAY)
    builder.run('message reply 1 "yes"', actor=builder.agent)
    builder.advance(HOOK_DELAY)
    return builder


@pytest.fixture
def server(builder):
    builder.run('message send "are you there" --environment main', actor=builder.user)
    with server_story(builder) as story:
        yield story


def test_a_displayed_part_and_its_complete_transcript_reach_chat_once(builder, tmp_path):
    first = "The first paragraph is here."
    second = "The second paragraph is here."
    builder.hook("s-1", HookSamples.message_display(second))
    row = agent_row(builder, first)
    row["message"]["content"].append({"type": "text", "text": second})
    run_hook(builder, transcript(tmp_path, row), TOOL_FINISHED)
    output = chat(builder)
    builder.expect_rows(output.count(first) == 1, output.count(second) == 1, detail=output)


@pytest.fixture
def refused_stop_story(builder):
    builder.run('message send "are you there" --environment main', actor=builder.user)
    builder.hook("s-1", HookSamples.prompt("go on"))
    builder.advance(HOOK_DELAY)
    builder.run('message send "is it committed" --environment main', actor=builder.user)
    builder.run('message reply 1 "yes"', actor=builder.agent)
    builder.advance(HOOK_DELAY)
    builder.expect_hook_refusal("s-1", HookSamples.stop(), "message")
    return builder


def test_a_line_held_after_a_reply_is_shown_whole_when_a_tool_comes(reply_story):
    reply_story.hook("s-1", HookSamples.message_display("Fixing the cart ", final=False))
    reply_story.hook("s-1", HookSamples.message_display("next."))
    expect_chat_count(reply_story, "Fixing the cart next.", 0)
    reply_story.hook("s-1", HookSamples.edit("src/cart.py"))
    expect_chat_count(reply_story, "Fixing the cart next.", 1)


def test_a_restarted_server_that_reads_the_file_again_records_nothing_twice(builder, tmp_path):
    path = transcript(tmp_path, agent_row(builder, AGENT_TEXT))
    run_hook(builder, path)
    builder.container.bind(TranscriptEntries, TranscriptEntries())
    run_hook(builder, path, TOOL_FINISHED)
    expect_chat_count(builder, AGENT_TEXT, 1)


def test_the_same_words_written_again_later_are_not_shown_twice(builder, tmp_path):
    path = transcript(tmp_path, agent_row(builder, AGENT_TEXT))
    run_hook(builder, path)
    builder.advance(timedelta(minutes=5))
    run_hook(builder, transcript(tmp_path, agent_row(builder, AGENT_TEXT)), TOOL_FINISHED)
    expect_chat_count(builder, AGENT_TEXT, 1)


def test_an_idle_agents_lost_text_reaches_the_chat_at_a_tick(builder, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path))
    folder = tmp_path / "projects" / "shop"
    folder.mkdir(parents=True)
    (folder / "s-1.jsonl").write_text(json.dumps(agent_row(builder, AGENT_TEXT)) + "\n")
    builder.advance(HOOK_DELAY)
    builder.tick("s-1")
    expect_chat_count(builder, AGENT_TEXT, 1)


def test_a_line_after_a_reply_shows_when_a_tool_follows_it_and_is_not_repeated(reply_story):
    reply_story.hook("s-1", HookSamples.message_display(AGENT_TEXT))
    expect_chat_count(reply_story, AGENT_TEXT, 0)
    reply_story.hook("s-1", TOOL_FINISHED)
    reply_story.hook("s-1", TOOL_FINISHED)
    expect_chat_count(reply_story, AGENT_TEXT, 1)


def test_a_closing_line_after_a_reply_stays_out_of_the_chat(reply_story):
    reply_story.hook("s-1", HookSamples.message_display("I told you where it stands."))
    reply_story.hook("s-1", HookSamples.stop())
    expect_chat_count(reply_story, "I told you where it stands.", 0)


def test_a_new_message_line_comes_at_the_next_hook_after_one_went_through_unchecked(server):
    server.expect_locked_hook_answer(hook_body("unchecked-tool"), "the journal let this through unchecked")
    server.expect_hook_answer("/hook", hook_body("next-tool"), 200, "new message 1")


def test_a_new_message_line_whose_hook_left_before_the_answer_comes_again_at_the_next_hook(server):
    server.post_hook_disconnect(hook_body("left-tool"))
    server.expect_hook_line_soon("new message 1", "next-tool")


def test_a_lost_hook_answer_retries_its_messages_after_another_writer_releases_the_database(server, monkeypatch):
    reset_attempted = Event()
    original_answer = HookEndpoint.answer_lost

    def busy_answer_dropped(endpoint, reply):
        with sqlite3.connect(server.story.home.database) as writer:
            writer.execute("BEGIN IMMEDIATE")
            try:
                original_answer(endpoint, reply)
            finally:
                writer.rollback()
                reset_attempted.set()

    monkeypatch.setattr(HookEndpoint, "answer_lost", busy_answer_dropped)
    server.post_hook_disconnect(hook_body("left-while-busy"))
    server.story.expect_rows(reset_attempted.wait(10), detail="the lost hook answer never attempted to reset its deliveries")
    folder = server.story.home.folder / "runtime" / "lost-hook-answers"
    server.story.expect_rows(list(folder.iterdir()), detail="the busy reset left no retry")
    server.expect_hook_answer("/hook", hook_body("next-after-busy"), 200, "new message 1")
    server.story.expect_rows(not list(folder.iterdir()))
    refusal, delivered_lines = server.hook_decision(hook_body("already-delivered"), {})
    server.story.expect_rows(refusal == "")
    server.story.expect_rows("new message 1" not in str(delivered_lines))


def dropped_answers_folder(story) -> Path:
    folder = story.home.folder / "runtime" / "lost-hook-answers"
    folder.mkdir(parents=True, exist_ok=True)
    return folder


@pytest.mark.parametrize("file_name", ["999999", "not-a-number"])
def test_a_lost_answer_file_that_cannot_be_retried_is_logged_and_removed_and_the_hook_is_answered(server, file_name):
    answers_folder = dropped_answers_folder(server.story)
    (answers_folder / file_name).touch()
    server.expect_hook_answer("/hook", hook_body(f"after-{file_name}"), 200, "new message 1")
    server.story.expect_rows(not list(answers_folder.iterdir()), f"lost hook answer {file_name} cannot be retried and is removed" in server.story.system_log_text())


def test_a_retry_that_finds_the_database_busy_fails_nothing_and_keeps_its_file(builder):
    reply = builder.hook("s-1", HookSamples.prompt("go on"))
    retries = HookDeliveryRetries(builder.home)
    retries.keep(reply.hook_call_id)
    builder.container.get(Database).set_busy_timeout(RETRY_BUSY_SECONDS)
    with sqlite3.connect(builder.home.database) as writer:
        writer.execute("BEGIN IMMEDIATE")
        retries.retry(builder.container)
        writer.rollback()
    answers_folder = dropped_answers_folder(builder)
    builder.expect_rows(list(answers_folder.iterdir()), "will retry at the next hook" in builder.system_log_text())
    retries.retry(builder.container)
    builder.expect_rows(not list(answers_folder.iterdir()))


def test_a_hook_returns_its_connection_with_the_default_busy_timeout(server):
    server.expect_hook_answer("/hook", hook_body("timeout-restored"), 200, "new message 1")
    with server.context.hook_database.used(QueuePriority.MAIN_AGENT_HOOK, 1) as database:
        server.story.expect_rows(database.busy_timeout_seconds() == BUSY_TIMEOUT_SECONDS)


def test_an_answer_that_arrived_delivers_the_message_once(server):
    server.expect_hook_answer("/hook", hook_body("first-tool"), 200, "new message 1")
    server.expect_hook_answer("/hook", hook_body("second-tool"), 200, '"refusal": ""')
    server.story.expect_text("message show 1", "delivered_at: 2", actor=server.story.user)


def hook_body(firing: str) -> dict[str, object]:
    return dict(TOOL_FINISHED.with_fields(session="s-1", environment="main", firing=firing, role="main").body)


def test_a_prompt_typed_in_the_terminal_shows_in_the_chat_as_the_users_message(builder):
    builder.hook("s-1", HookSamples.prompt("please look at the cart"))
    builder.expect_text("message show 1", "type: user", "text: please look at the cart", actor=builder.user)




def test_a_lost_repeated_closing_line_stays_out_even_if_a_tool_follows(builder, tmp_path):
    builder.run('message send "What happened?" --environment main', actor=builder.user)
    builder.hook("s-1", HookSamples.prompt("go on"))
    builder.run('message reply 1 "The worker has task 7246 and its tests passed."', actor=builder.agent)
    text = "The worker has task 7246 and its tests passed."
    run_hook(builder, transcript(tmp_path, agent_row(builder, text)), TOOL_FINISHED)
    expect_chat_count(builder, text, 1)


@pytest.fixture
def reaction_builder(builder):
    builder.hook("s-1", HookSamples.prompt("[journal] the user reacted to message:1: act if it asks"))
    builder.advance(timedelta(seconds=1))
    return builder


def test_a_later_turns_tool_does_not_release_lost_reaction_closing_text(reaction_builder, tmp_path):
    builder = reaction_builder
    text = "Finished that reaction turn."
    path = transcript(tmp_path, agent_row(builder, text))
    builder.advance(timedelta(seconds=1))
    builder.hook("s-1", HookSamples.prompt("A new request"))
    builder.advance(timedelta(seconds=1))
    builder.hook("s-1", TOOL_FINISHED)
    run_hook(builder, path, HookSamples.stop())
    expect_chat_count(builder, text, 0)


def thinking_row(story, thinking_text: str, text: str = "") -> dict[str, object]:
    blocks = [{"type": "thinking", "thinking": thinking_text, "signature": "sig"}, *([{"type": "text", "text": text}] if text else [])]
    return {"type": "assistant", "timestamp": entry_timestamp(story, timedelta()), "message": {"role": "assistant", "content": blocks}}


def test_text_written_before_a_tool_and_the_closing_text_of_a_turn_with_no_reply_both_reach_the_chat(builder):
    parsed = "The parser read 12 files and found 3 faults in the cart code."
    closing = "I fixed the 3 faults and the cart stories pass."
    builder.hook("s-1", HookSamples.prompt("look at the parser"))
    builder.hook("s-1", HookSamples.message_display(parsed))
    builder.hook("s-1", TOOL_FINISHED)
    builder.hook("s-1", HookSamples.message_display(closing))
    builder.hook("s-1", HookSamples.stop())
    expect_chat_count(builder, parsed, 1)
    expect_chat_count(builder, closing, 1)


def test_text_that_repeats_the_reply_the_agent_sent_by_command_is_not_said_twice(builder):
    reply = "The parser read 12 files and found 3 faults in the cart code."
    builder.run('message send "what did the parser find" --environment main', actor=builder.user)
    builder.hook("s-1", HookSamples.prompt("go on"))
    builder.advance(HOOK_DELAY)
    builder.run(f'message reply 1 "{reply}"', actor=builder.agent)
    builder.hook("s-1", HookSamples.message_display(reply))
    builder.hook("s-1", TOOL_FINISHED)
    builder.hook("s-1", HookSamples.stop())
    expect_chat_count(builder, reply, 1)

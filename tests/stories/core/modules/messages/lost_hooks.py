import json
from datetime import timedelta

import pytest

from core.base.provider.written_rows import WrittenRows
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story

LOST_TEXT = "Loading the nudge records takes 10.5 seconds, so I am reading the query code now."
TOOL_FINISHED = HookSamples.edit("src/cart.py").with_fields(event="post_tool_use")
SETTLED = timedelta(seconds=30)


def agent_row(story, text: str, age: timedelta = timedelta()) -> dict[str, object]:
    return {"type": "assistant", "timestamp": written_at(story, age), "message": {"role": "assistant", "content": [{"type": "text", "text": text}]}}


def typed_row(story, text: str, **fields: object) -> dict[str, object]:
    return {"type": "user", "promptSource": "typed", "timestamp": written_at(story, timedelta()), "message": {"role": "user", "content": text}, **fields}


def codex_row(story, role: str, text: str) -> dict[str, object]:
    block = {"type": "output_text" if role == "assistant" else "input_text", "text": text}
    return {"type": "response_item", "timestamp": written_at(story, timedelta()), "payload": {"type": "message", "role": role, "content": [block]}}


def written_at(story, age: timedelta) -> str:
    return (story.clock.timestamp().value - age).isoformat()


def transcript(tmp_path, *rows: dict[str, object]) -> str:
    path = tmp_path / "session.jsonl"
    with path.open("a") as file:
        file.write("".join(json.dumps(row) + "\n" for row in rows))
    return str(path)


def later_hook(story, path: str, sample=None) -> None:
    story.advance(SETTLED)
    story.hook("s-1", (sample or HookSamples.prompt("go on")).with_raw({"transcript_path": path}))


def chat(story) -> str:
    return story.run("message list --environment main", actor=story.user).output_text


def expect_chat_count(story, text: str, expected: int) -> None:
    shown = chat(story)
    assert shown.count(text) == expected, shown


@pytest.fixture
def builder(new_story):
    return new_story(fixture=BuilderWithUser)


@pytest.fixture
def replied(builder):
    builder.run('message send "are you there" --environment main', actor=builder.user)
    builder.hook("s-1", HookSamples.prompt("go on"))
    builder.advance(SETTLED)
    builder.run('message reply 1 "yes"', actor=builder.agent)
    builder.advance(SETTLED)
    return builder


@pytest.fixture
def served(builder):
    builder.run('message send "are you there" --environment main', actor=builder.user)
    with server_story(builder) as story:
        yield story


def test_text_whose_display_hook_went_unchecked_reaches_the_chat_at_a_later_hook(builder, tmp_path):
    path = transcript(tmp_path, agent_row(builder, LOST_TEXT))
    later_hook(builder, path)
    expect_chat_count(builder, LOST_TEXT, 1)


def test_text_the_display_hook_recorded_is_not_recorded_again(builder, tmp_path):
    builder.hook("s-1", HookSamples.message_display(LOST_TEXT))
    later_hook(builder, transcript(tmp_path, agent_row(builder, LOST_TEXT, SETTLED)))
    expect_chat_count(builder, LOST_TEXT, 1)


def test_a_few_words_the_display_hook_kept_out_of_the_chat_stay_out(builder, tmp_path):
    builder.hook("s-1", HookSamples.prompt("[journal] output 3 ended: finished"))
    builder.hook("s-1", HookSamples.message_display("The stories are running."))
    later_hook(builder, transcript(tmp_path, agent_row(builder, "The stories are running.")), TOOL_FINISHED)
    expect_chat_count(builder, "The stories are running.", 0)


def test_text_just_written_waits_for_its_own_display_hook(builder, tmp_path):
    path = transcript(tmp_path, agent_row(builder, LOST_TEXT))
    builder.hook("s-1", HookSamples.prompt("go on").with_raw({"transcript_path": path}))
    expect_chat_count(builder, LOST_TEXT, 0)
    builder.hook("s-1", HookSamples.message_display(LOST_TEXT))
    later_hook(builder, path, TOOL_FINISHED)
    expect_chat_count(builder, LOST_TEXT, 1)


def test_a_restarted_server_that_reads_the_file_again_records_nothing_twice(builder, tmp_path):
    path = transcript(tmp_path, agent_row(builder, LOST_TEXT))
    later_hook(builder, path)
    builder.container.bind(WrittenRows, WrittenRows())
    later_hook(builder, path, TOOL_FINISHED)
    expect_chat_count(builder, LOST_TEXT, 1)


def test_the_same_words_written_again_later_are_a_new_text(builder, tmp_path):
    path = transcript(tmp_path, agent_row(builder, LOST_TEXT))
    later_hook(builder, path)
    builder.advance(timedelta(minutes=5))
    later_hook(builder, transcript(tmp_path, agent_row(builder, LOST_TEXT)), TOOL_FINISHED)
    expect_chat_count(builder, LOST_TEXT, 2)


def test_text_written_before_the_agent_started_is_not_recorded(builder, tmp_path):
    later_hook(builder, transcript(tmp_path, agent_row(builder, LOST_TEXT, timedelta(days=2))))
    expect_chat_count(builder, LOST_TEXT, 0)


def test_codex_text_whose_hook_went_unchecked_reaches_the_chat(builder, tmp_path):
    later_hook(builder, transcript(tmp_path, codex_row(builder, "assistant", LOST_TEXT)), HookSamples.prompt("go on").with_fields(program="codex"))
    expect_chat_count(builder, LOST_TEXT, 1)


def test_an_idle_agents_lost_text_reaches_the_chat_at_a_tick(builder, tmp_path, monkeypatch):
    monkeypatch.setenv("CLAUDE_CONFIG_DIR", str(tmp_path))
    folder = tmp_path / "projects" / "shop"
    folder.mkdir(parents=True)
    (folder / "s-1.jsonl").write_text(json.dumps(agent_row(builder, LOST_TEXT)) + "\n")
    builder.advance(SETTLED)
    builder.tick("s-1")
    expect_chat_count(builder, LOST_TEXT, 1)


def test_text_after_a_reply_shows_once_a_tool_follows_it(replied):
    replied.hook("s-1", HookSamples.message_display(LOST_TEXT))
    expect_chat_count(replied, LOST_TEXT, 0)
    replied.hook("s-1", TOOL_FINISHED)
    replied.hook("s-1", TOOL_FINISHED)
    expect_chat_count(replied, LOST_TEXT, 1)


def test_a_second_text_after_a_reply_is_still_held_until_its_tool(replied):
    replied.hook("s-1", HookSamples.message_display("First part."))
    replied.hook("s-1", TOOL_FINISHED)
    replied.hook("s-1", HookSamples.message_display("All of it is in."))
    expect_chat_count(replied, "First part.", 1)
    expect_chat_count(replied, "All of it is in.", 0)


def test_a_closing_line_after_a_reply_stays_out_of_the_chat(replied):
    replied.hook("s-1", HookSamples.message_display("I told you where it stands."))
    replied.hook("s-1", HookSamples.stop())
    expect_chat_count(replied, "I told you where it stands.", 0)


def test_lost_text_after_a_reply_shows_when_a_tool_came_after_it(replied, tmp_path):
    later_hook(replied, transcript(tmp_path, agent_row(replied, LOST_TEXT)), TOOL_FINISHED)
    expect_chat_count(replied, LOST_TEXT, 1)


def test_a_lost_closing_line_after_a_reply_stays_out_of_the_chat(replied, tmp_path):
    later_hook(replied, transcript(tmp_path, agent_row(replied, "I told you where it stands.")))
    expect_chat_count(replied, "I told you where it stands.", 0)


def test_a_new_message_line_comes_at_the_next_hook_after_one_went_through_unchecked(served):
    served.expect_locked_hook_answer(hook_body("unchecked-tool"), "the journal let this through unchecked")
    served.expect_hook_answer("/hook", hook_body("next-tool"), 200, "new message 1")


def test_a_new_message_line_whose_hook_left_before_the_answer_comes_again_at_the_next_hook(served):
    served.send_hook_and_leave(hook_body("left-tool"))
    served.expect_hook_line_soon("new message 1", "next-tool")


def test_an_answer_that_arrived_delivers_the_message_once(served):
    served.expect_hook_answer("/hook", hook_body("first-tool"), 200, "new message 1")
    served.expect_hook_answer("/hook", hook_body("second-tool"), 200, '"refusal": ""')
    served.story.expect_text("message show 1", "delivered_at: 2", actor=served.story.user)


def hook_body(firing: str) -> dict[str, object]:
    return dict(TOOL_FINISHED.with_fields(session="s-1", environment="main", firing=firing, role="main").body)


def test_a_prompt_typed_in_the_terminal_shows_in_the_chat_as_the_users_message(builder):
    builder.hook("s-1", HookSamples.prompt("please look at the cart"))
    builder.expect_text("message show 1", "type: user", "text: please look at the cart", actor=builder.user)



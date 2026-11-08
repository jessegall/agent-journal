import json

from core.base.driver.tool_type import ToolType
from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.support.story_checks import expect_count_shown, expect_value_with

ENVELOPE = '<cross-session-message from-name="shop-e6" from-mode="bypass">\nCheck 138 failed\n</cross-session-message>'


def transcript_with(tmp_path, *rows) -> str:
    path = tmp_path / "session.jsonl"
    path.write_text("".join(json.dumps(row) + "\n" for row in rows))
    return str(path)


def queued(content: str, timestamp: str = "2026-11-02T10:00:00Z") -> dict[str, str]:
    return {"type": "queue-operation", "operation": "enqueue", "timestamp": timestamp, "content": content}


def hook_with(story, transcript: str) -> None:
    story.hook("s-1", HookSamples.prompt("go on").with_raw({"transcript_path": transcript}))


def test_a_message_from_another_session_shows_in_the_chat_once(new_story, tmp_path):
    story = new_story(fixture=BuilderWithUser)
    transcript = transcript_with(tmp_path, queued(ENVELOPE))
    hook_with(story, transcript)
    hook_with(story, transcript)
    listed = story.run("message list --json", actor=story.user).output_text
    expect_count_shown(listed, "Check 138 failed", 1)
    expect_value_with(listed, '"peer": "shop-e6"')
    expect_value_with(listed, '"type": "peer"')


def test_a_queued_prompt_of_the_user_is_no_peer_message(new_story, tmp_path):
    story = new_story(fixture=BuilderWithUser)
    hook_with(story, transcript_with(tmp_path, queued("carry on")))
    story.expect_no_text("message list --json", "carry on", actor=story.user)


def test_a_message_reaches_the_chat_while_the_agent_waits_on_a_question(new_story, tmp_path):
    story = new_story(fixture=BuilderWithUser)
    story.run('question ask "Which database?" --context "A story asks this so its card and answer can be checked." --options sqlite postgres --environment main', actor=story.agent)
    hook_with(story, transcript_with(tmp_path, queued(ENVELOPE)))
    story.expect_text("message list --json", "Check 138 failed", actor=story.user)


def test_a_peer_message_does_not_wait_as_unread(new_story, tmp_path):
    story = new_story(fixture=BuilderWithUser)
    hook_with(story, transcript_with(tmp_path, queued(ENVELOPE)))
    story.expect_no_text("message unread", "Check 138 failed", actor=story.agent)


def test_a_message_sent_to_another_agent_shows_in_the_chat_naming_who_it_went_to(new_story):
    story = new_story(fixture=BuilderWithUser)
    sample = HookSamples.tool_use("SendMessage", ToolType.UNCATEGORISED, [], None).with_raw({"tool_input": {"to": "Dijkstra", "message": "Look at the merge"}}).with_fields(event="post_tool_use")
    story.hook("s-1", sample)
    listed = story.run("message list --json", actor=story.user)
    listed.expect_text('"recipient": "Dijkstra"')
    listed.expect_text("Look at the merge")


KNOWN_ADDRESS = "uds:/tmp/cc-socks/88554.sock"
ADDRESSED_ENVELOPE = f'<cross-session-message from="{KNOWN_ADDRESS}" from-name="code-commandments-de" from-mode="bypass">\nThe rules are on\n</cross-session-message>'


def sent_to(story, transcript: str, address: str) -> None:
    sample = HookSamples.tool_use("SendMessage", ToolType.UNCATEGORISED, [], None).with_raw({"transcript_path": transcript, "tool_input": {"to": address, "message": f"Hello {address}"}}).with_fields(event="post_tool_use")
    story.hook("s-1", sample)


def test_a_message_sent_to_a_known_address_names_the_session_and_one_to_an_unknown_address_names_the_address(new_story, tmp_path):
    story = new_story(fixture=BuilderWithUser)
    transcript = transcript_with(tmp_path, queued(ADDRESSED_ENVELOPE))
    sent_to(story, transcript, KNOWN_ADDRESS)
    sent_to(story, transcript, "uds:/tmp/cc-socks/1.sock")
    listed = story.run("message list --json", actor=story.user)
    listed.expect_text('"recipient": "code-commandments-de"')
    listed.expect_text('"recipient": "uds:/tmp/cc-socks/1.sock"')
    listed.expect_text('"peer": "code-commandments-de"')

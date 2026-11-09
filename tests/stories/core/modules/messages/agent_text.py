import pytest

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted


def messages_text(story) -> str:
    return story.run("message list").output_text


def test_the_final_text_block_of_an_agent_turn_becomes_a_chat_message_of_the_agent(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("The totals are fixed."))
    expect_messages_text(story, "The totals are fixed.")
    story.expect_success("message list", f"1  {story.agent.id}  agent  The totals are fixed.  []  {{}}  []  []")


def test_the_same_display_hook_sent_twice_makes_one_message(new_story):
    story = new_story(fixture=BuilderStarted)
    sample = HookSamples.message_display("Done.").with_fields(firing="firing-1")
    story.hook("s-1", sample)
    story.hook("s-1", sample)
    expect_count_messages(story, "Done.", 1)


def test_a_text_block_that_is_not_final_makes_no_message(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("Still thinking", final=False))
    expect_absent_messages_text(story, "Still thinking")


def test_an_empty_text_block_makes_no_message(new_story):
    story = new_story(fixture=BuilderStarted)
    story.hook("s-1", HookSamples.message_display("   "))
    expect_messages(story, "nothing found")


@pytest.mark.parametrize("parts, shown, left_out", [
    pytest.param([("The first paragraph.\n\n", False, "m1"), ("The second ", False, "m1"), ("paragraph.", True, "m1")], "The first paragraph.\n\nThe second paragraph.", "nothing else", id="parts of one block make one message"),
    pytest.param([("An interrupted text. ", False, "m1"), ("The next text.", True, "m2")], "The next text.", "An interrupted text.", id="a part of another message is left out"),
    pytest.param([("The first block ", False, "m1"), ("is done.", True, "m1"), ("The second block.", True, "m1")], "The second block.", "is done.The second block.", id="a finished block is left out of the next one"),
])
def test_a_text_block_is_built_from_its_parts(new_story, parts, shown, left_out):
    story = new_story(fixture=BuilderStarted)
    for text, final, message in parts:
        story.hook("s-1", HookSamples.message_display(text, final=final, message_id=message))
    latest = story.run("message list").output_text.count("  agent  ")
    story.expect_text(f"message show {latest}", *shown.split("\n\n"))
    expect_absent_messages_text(story, left_out)


def expect_messages_text(story, expected) -> None:
    actual = messages_text(story)
    assert expected in actual, actual


def expect_absent_messages_text(story, expected) -> None:
    actual = messages_text(story)
    assert expected not in actual, actual


def expect_messages(story, expected) -> None:
    actual = messages_text(story).strip()
    assert actual == expected, actual


def expect_count_messages(story, text, expected) -> None:
    actual = messages_text(story).count(text)
    assert actual == expected, actual

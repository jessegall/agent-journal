import pytest

from core.testing.hook_samples import HookSamples
from tests.stories.core.support.coding_fixtures import BuilderStarted


def messages_text(story) -> str:
    return story.run("message list").output_text


@pytest.mark.parametrize("parts, shown, missing_text", [
    pytest.param([("The first paragraph.\n\n", False, "m1"), ("The second ", False, "m1"), ("paragraph.", True, "m1")], "The first paragraph.\n\nThe second paragraph.", "nothing else", id="parts of one block make one message"),
    pytest.param([("An interrupted text. ", False, "m1"), ("The next text.", True, "m2")], "The next text.", "An interrupted text.", id="a part of another message is left out"),
    pytest.param([("The first block ", False, "m1"), ("is done.", True, "m1"), ("The second block.", True, "m1")], "The second block.", "is done.The second block.", id="a finished block is left out of the next one"),
])
def test_a_text_block_is_built_from_its_parts(new_story, parts, shown, missing_text):
    story = new_story(fixture=BuilderStarted)
    for text, final, message in parts:
        story.hook("s-1", HookSamples.message_display(text, final=final, message_id=message))
    latest = story.run("message list").output_text.count("  agent  ")
    story.expect_text(f"message show {latest}", *shown.split("\n\n"))
    expect_absent_messages_text(story, missing_text)


def expect_absent_messages_text(story, expected) -> None:
    actual = messages_text(story)
    assert expected not in actual, actual

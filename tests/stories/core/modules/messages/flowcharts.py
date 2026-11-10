import json

from tests.stories.core.support.fixtures import UserJoined
from engine.testing.expectations.expect_row import expect_row


def test_a_flowchart_is_a_message_with_its_title_and_its_arrows(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_text('message flowchart "How a task moves" --edge "Open -> Started" --edge "Started -> Done: its outcome is written" --environment main', "flowchart", "drawn", actor=story.agent)
    row = json.loads(story.run("message feed --environment 1 --json", actor=story.user).output_text)["rows"][0]
    expect_row(row, text="How a task moves")
    expect_value_8(row, [["Open", "Started", ""], ["Started", "Done", "its outcome is written"]])


def test_a_flowchart_needs_an_arrow_and_each_must_read_as_one(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_refusal('message flowchart "Nothing" --environment main', "at least one arrow", actor=story.agent)
    story.expect_refusal('message flowchart "Bad" --edge "Open then Started" --environment main', "is not an arrow", actor=story.agent)
    story.expect_absent("message feed --environment 1", "Bad", actor=story.user)


def expect_value_8(row, expected) -> None:
    actual = json.loads(row['flowchart_edges'])
    assert actual == expected, actual

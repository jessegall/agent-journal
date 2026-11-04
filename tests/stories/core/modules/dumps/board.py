import json

from tests.stories.core.modules.dumps.dumps import dump_story
from core.testing.expect_row import expect_row


def board(story, line: str = "dump board") -> dict:
    return json.loads(story.run(f"{line} --json", actor=story.user).output_text)


def test_the_board_gives_each_dump_with_its_items_in_order(new_story):
    story = dump_story(new_story)
    story.run('dump note 1 1 "a fault in the cart"', actor=story.agent)
    answer = board(story)
    expect_row(answer, total=1)
    dump = answer["dumps"][0]
    expect_row(dump, title="")
    expect_row(dump, outcome="")
    assert [(item["text"], item["state"], item["note"]) for item in dump["items"]] == [("The cart rounds twice", "noted", "a fault in the cart"), ("Ship on Friday", "new", "")]


def test_an_item_filed_carries_its_summary_and_the_rows_it_became(new_story):
    story = dump_story(new_story)
    story.run('task make "Round the cart once" --environment main', actor=story.agent)
    story.run('dump filed 1 1 "made a task" --refs tasks:1', actor=story.agent)
    item = board(story)["dumps"][0]["items"][0]
    expect_row(item, summary="made a task")
    expect_row(item, refs=["tasks:1"])


def test_the_board_pages_back_from_the_number_it_is_given(new_story):
    story = dump_story(new_story)
    story.run('dump make "Second" --parts "One"', actor=story.user)
    assert [dump["id"] for dump in board(story)["dumps"]] == [2, 1]
    assert [dump["id"] for dump in board(story, "dump board --before 2")["dumps"]] == [1]

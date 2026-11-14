import json

from tests.stories.core.support.coding_fixtures import StartedTaskBuilder


def task_row(story) -> dict:
    return json.loads(story.run("task show 1 --json", actor=story.agent).output_text)


def test_a_started_task_blocked_and_unblocked_by_hand_is_open_with_no_holder(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run('task block 1 --reason "waits on the user"', actor=story.agent)
    story.run("task unblock 1", actor=story.agent)
    row = task_row(story)
    story.expect_rows(row["state"] == "open", row["holder_id"] is None, detail=row)

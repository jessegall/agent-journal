import pytest

import json
from datetime import timedelta

from tests.stories.core.support.fixtures import UserJoined


def test_the_board_brings_the_first_page_of_every_group_in_one_answer(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task cancel 2 --reason "not needed"', actor=story.agent)
    story.expect_text("task board --environment main", "open: 1", "cancelled: 1", actor=story.user)
    answer = story.run("task board --environment main --json", actor=story.user).output_text
    assert "Fix the cart" in answer and "Fix the totals" in answer


def test_one_state_can_be_read_a_page_at_a_time(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task cancel 1 --reason "not needed"', actor=story.agent)
    assert "Fix the totals" in story.run("task board --environment main --state cancelled --json", actor=story.user).output_text


def test_the_board_holds_only_the_fields_a_card_draws_never_a_brief(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --brief "Long words about the cart" --environment main', actor=story.agent)
    answer = story.run("task board --environment main --json", actor=story.user).output_text
    assert "Fix the cart" in answer and "Long words" not in answer


def test_one_state_pages_older_rows_by_id_and_reads_as_many_as_asked(new_story):
    story = new_story(fixture=UserJoined)
    for title in ("One", "Two", "Three"):
        story.run(f'task make "{title}" --environment main', actor=story.user)
    older = story.run("task board --environment main --state open --before-id 3 --limit 1 --json", actor=story.user).output_text
    assert "Two" in older and "One" not in older and "Three" not in older
    assert '"total": 3' in older or '"total":3' in older
    board_text = story.run("task board --environment main --state open --limit 2 --json", actor=story.user).output_text
    assert "Three" in board_text and "Two" in board_text and "One" not in board_text


def test_a_limit_sets_the_page_of_every_group_of_the_whole_board(three_board_tasks):
    story, number = three_board_tasks
    for number in (1, 2):
        story.expect_success(f'task cancel {number} --reason "not needed"', actor=story.user)
    groups = json.loads(story.run("task board --environment main --limit 1 --json", actor=story.user).output_text)["groups"]
    rows = {group["state"]: group for group in groups}
    assert [row["id"] for row in rows["open"]["rows"]] == [3]
    assert len(rows["cancelled"]["rows"]) == 1 and rows["cancelled"]["total"] == 2


def test_the_board_brings_the_first_page_of_the_finished_groups_from_the_task_closed_last_and_pages_by_that_time(three_board_tasks):
    story, number = three_board_tasks
    for number in (2, 3, 1):
        story.advance(timedelta(seconds=1))
        story.expect_success(f'task cancel {number} --reason "not needed"', actor=story.user)
    groups = json.loads(story.run("task board --environment main --json", actor=story.user).output_text)["groups"]
    cancelled = next(group for group in groups if group["state"] == "cancelled")
    assert [row["id"] for row in cancelled["rows"]] == [1, 3, 2]
    page = json.loads(story.run(f"task board --environment main --state cancelled --before-closed-at {cancelled['rows'][0]['closed_at']} --json", actor=story.user).output_text)["groups"][0]
    assert [row["id"] for row in page["rows"]] == [3, 2]


def test_delegated_tasks_come_after_blocked_and_before_open(new_story):
    story = new_story(fixture=UserJoined)
    states = [group["state"] for group in json.loads(story.run("task board --environment main --json", actor=story.user).output_text)["groups"]]
    assert states.index("blocked") < states.index("delegated") < states.index("open"), states


@pytest.fixture
def three_board_tasks(new_story):
    story = new_story(fixture=UserJoined)
    for number in (1, 2, 3):
        story.run(f'task make "Task {number}" --environment main', actor=story.user)
    return story, number

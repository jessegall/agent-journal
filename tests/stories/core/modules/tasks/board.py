import pytest

import json
from datetime import timedelta

from tests.stories.core.modules.tasks.task_counts import FourStatesTasks, counted_task
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.support.story_checks import expect_id_cancelled, expect_index, expect_value, expect_value_with, expect_value_without


def test_the_board_brings_the_first_page_of_every_group_in_one_answer(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task cancel 2 --reason "not needed"', actor=story.agent)
    story.expect_text("task board --environment main", "open: 1", "cancelled: 1", actor=story.user)
    answer = story.run("task board --environment main --json", actor=story.user)
    answer.expect_text("Fix the cart")
    answer.expect_text("Fix the totals")


def test_one_state_can_be_read_a_page_at_a_time(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task cancel 1 --reason "not needed"', actor=story.agent)
    story.expect_text("task board --environment main --state cancelled --json", "Fix the totals", actor=story.user)


def test_the_board_holds_only_the_fields_a_card_draws_never_a_brief(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --brief "Long words about the cart" --environment main', actor=story.agent)
    answer = story.run("task board --environment main --json", actor=story.user)
    answer.expect_text("Fix the cart")
    answer.expect_no_text("Long words")


def test_one_state_pages_older_rows_by_id_and_reads_as_many_as_asked(new_story):
    story = new_story(fixture=UserJoined)
    for title in ("One", "Two", "Three"):
        story.run(f'task make "{title}" --environment main', actor=story.user)
    older = story.run("task board --environment main --state open --before-id 3 --limit 1 --json", actor=story.user).output_text
    expect_value_with(older, "Two")
    expect_value_without(older, "One")
    expect_value_without(older, "Three")
    expect_value_13('"total": 3', older, '"total":3')
    board_text = story.run("task board --environment main --state open --limit 2 --json", actor=story.user)
    board_text.expect_text("Three")
    board_text.expect_text("Two")
    board_text.expect_no_text("One")


def test_a_limit_sets_the_page_of_every_group_of_the_whole_board(three_board_tasks):
    story, number = three_board_tasks
    for number in (1, 2):
        story.expect_success(f'task cancel {number} --reason "not needed"', actor=story.user)
    groups = json.loads(story.run("task board --environment main --limit 1 --json", actor=story.user).output_text)["groups"]
    rows = {group["state"]: group for group in groups}
    expect_id_open(rows, [3])
    expect_cancelled(rows, 1)
    expect_total_cancelled(rows, 2)


def test_the_board_brings_the_first_page_of_the_finished_groups_from_the_task_closed_last_and_pages_by_that_time(three_board_tasks):
    story, number = three_board_tasks
    for number in (2, 3, 1):
        story.advance(timedelta(seconds=1))
        story.expect_success(f'task cancel {number} --reason "not needed"', actor=story.user)
    groups = json.loads(story.run("task board --environment main --json", actor=story.user).output_text)["groups"]
    cancelled = next(group for group in groups if group["state"] == "cancelled")
    expect_id_cancelled(cancelled, [1, 3, 2])
    page = json.loads(story.run(f"task board --environment main --state cancelled --before-closed-at {cancelled['rows'][0]['closed_at']} --json", actor=story.user).output_text)["groups"][0]
    expect_id_cancelled(page, [3, 2])


def test_the_board_has_no_delegated_group(new_story):
    story = new_story(fixture=UserJoined)
    states = [group["state"] for group in json.loads(story.run("task board --environment main --json", actor=story.user).output_text)["groups"]]
    expect_value_without(states, "delegated")
    expect_index(states, "testing", "blocked", "open")


def test_a_delegated_task_is_in_the_group_of_its_state(new_story):
    story = new_story(fixture=FourStatesTasks)
    groups = {group["state"]: group for group in json.loads(story.run("task board --environment main --json", actor=story.user).output_text)["groups"]}
    expect_value_with([row["id"] for row in groups["open"]["rows"]], counted_task(story, 3))


def test_a_group_can_leave_out_the_tasks_of_a_plan_in_its_rows_and_its_count(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('task make "In a plan" --environment main', actor=story.user)
    story.expect_success('task make "Alone" --environment main', actor=story.user)
    story.expect_success('plan make "The rebuild" --brief "all of it" --environment main', actor=story.user)
    story.expect_success('phase make --plan 1 "First" --goal "it works"', actor=story.user)
    story.expect_success("phase place 1 --phase 1", actor=story.user)
    read = lambda flags: {group["state"]: group for group in json.loads(story.run(f"task board --environment main --json {flags}", actor=story.user).output_text)["groups"]}
    shown, hidden = read(""), read("--hide-plan-tasks open")
    expect_value((shown["open"]["total"], [row["id"] for row in shown["open"]["rows"]]), (2, [2, 1]))
    expect_value((hidden["open"]["total"], [row["id"] for row in hidden["open"]["rows"]]), (1, [2]))
    page = json.loads(story.run("task board --environment main --json --state open --hide-plan-tasks open --before-id 2", actor=story.user).output_text)["groups"][0]
    expect_value((page["total"], page["rows"]), (1, []))


def test_the_blocked_tasks_come_whole_whatever_the_limit(three_board_tasks):
    story, number = three_board_tasks
    for number in (1, 2, 3):
        story.expect_success(f'task block {number} --reason "waits"', actor=story.user)
    groups = json.loads(story.run("task board --environment main --limit 1 --json", actor=story.user).output_text)["groups"]
    rows = {group["state"]: group for group in groups}
    expect_value([row["id"] for row in rows["blocked"]["rows"]], [3, 2, 1])


@pytest.fixture
def three_board_tasks(new_story):
    story = new_story(fixture=UserJoined)
    for number in (1, 2, 3):
        story.run(f'task make "Task {number}" --environment main', actor=story.user)
    return story, number


def expect_cancelled(rows, expected) -> None:
    actual = len(rows['cancelled']['rows'])
    assert actual == expected, actual


def expect_total_cancelled(rows, expected) -> None:
    actual = rows['cancelled']['total']
    assert actual == expected, actual


def expect_id_open(rows, expected) -> None:
    actual = [row['id'] for row in rows['open']['rows']]
    assert actual == expected, actual


def expect_value_13(text, older, text_2) -> None:
    actual = text in older or text_2 in older
    assert actual, actual

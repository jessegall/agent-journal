import json
from datetime import timedelta

from tests.stories.core.support.fixtures import UserJoined


def counts(story, arguments=""):
    answer = story.run(f"task counts --environment main --json {arguments}", actor=story.user)
    assert answer.code == 0, answer.output_text
    return json.loads(answer.output_text)


def make_tasks(story):
    helper = story.new_row_id("agent start counting-helper claude helper --environment main")
    started, blocked, delegated, done = (story.new_row_id(f'task make "Counted task {number}" --environment main', actor=story.user) for number in range(4))
    story.new_row_id('task make "Left open" --environment main', actor=story.user)
    story.expect_success(f"task start {started}", actor=story.user)
    story.expect_success(f'task block {blocked} --reason "Waiting for a review"', actor=story.user)
    story.expect_success(f"task assign {delegated} --to {helper}", actor=story.user)
    story.expect_success(f"task start {done}", actor=story.user)
    return done


def test_the_counts_show_what_stands_now_and_the_tasks_completed_in_the_last_day(new_story):
    story = new_story(fixture=UserJoined)
    done = make_tasks(story)
    story.expect_success(f'task close {done} --outcome "Done"', actor=story.user)
    answer = counts(story)
    story.expect_rows((answer["started"], answer["blocked"], answer["delegated"], answer["completed"]) == (1, 1, 1, 1), detail=str(answer))


def test_the_completed_count_follows_the_last_hours_a_time_and_a_reset(new_story):
    story = new_story(fixture=UserJoined)
    done = make_tasks(story)
    story.expect_success(f'task close {done} --outcome "Done"', actor=story.user)
    story.advance(timedelta(hours=3))
    story.expect_rows(counts(story, "--hours 2")["completed"] == 0, counts(story, "--hours 4")["completed"] == 1, counts(story)["completed"] == 1)
    story.advance(timedelta(hours=22))
    story.expect_rows(counts(story)["completed"] == 0, counts(story, "--hours 48")["completed"] == 1)
    since = counts(story, "--hours 48")["since"]
    story.expect_rows(counts(story, f"--since {since}")["completed"] == 1)
    reset = counts(story, "--hours 1")["since"]
    second = story.new_row_id('task make "Completed after the reset" --environment main', actor=story.user)
    story.expect_success(f"task start {second}", actor=story.user)
    story.advance(timedelta(minutes=1))
    story.expect_success(f'task close {second} --outcome "Done"', actor=story.user)
    story.expect_rows(counts(story, f"--since {reset}")["completed"] == 1, counts(story, "--hours 48")["completed"] == 2)

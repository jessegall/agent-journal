import json
from datetime import timedelta

from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


class TasksInFourStates(StoryFixture):
    """Counted task 1 is started, 2 blocked, 3 delegated to a worker, 4 completed and 5 open; task 1 of the fixture is delegated to the worker too."""

    parent = OrchestratorWithOpenTask

    def steps(self, story):
        repository_environment(story)
        worker = dispatched_worker(story).id
        started, blocked, delegated, done, _ = (story.new_row_id(f'task make "Counted task {number}" --environment main', actor=story.agent) for number in range(1, 6))
        story.expect_success(f"task start {started} --environment main", actor=story.agent)
        story.expect_success(f'task block {blocked} --reason "Waiting for a review" --environment main', actor=story.agent)
        story.expect_success(f"task assign {delegated} --to {worker} --environment main", actor=story.agent)
        story.expect_success(f"task start {done} --environment main", actor=story.agent)
        story.expect_success(f'task close {done} --outcome "Done" --environment main', actor=story.agent)


def counted_task(story, number):
    rows = json.loads(story.run("task list --environment main --json --limit 50", actor=story.user).output_text)["rows"]
    return next(row["id"] for row in rows if row["title"] == f"Counted task {number}")


def counts(story, arguments=""):
    answer = story.run(f"task counts --environment main --json {arguments}", actor=story.user)
    assert answer.code == 0, answer.output_text
    return json.loads(answer.output_text)


def test_the_counts_show_what_stands_now_and_the_tasks_completed_in_the_last_day(new_story):
    story = new_story(fixture=TasksInFourStates)
    answer = counts(story)
    story.expect_rows((answer["started"], answer["blocked"], answer["delegated"], answer["completed"]) == (1, 1, 2, 1), detail=str(answer))


def test_the_completed_count_follows_the_last_hours_a_time_and_a_reset(new_story):
    story = new_story(fixture=TasksInFourStates)
    story.advance(timedelta(hours=3))
    story.expect_rows(counts(story, "--hours 2")["completed"] == 0, counts(story, "--hours 4")["completed"] == 1, counts(story)["completed"] == 1)
    story.advance(timedelta(hours=22))
    story.expect_rows(counts(story)["completed"] == 0, counts(story, "--hours 48")["completed"] == 1)
    since = counts(story, "--hours 48")["since"]
    story.expect_rows(counts(story, f"--since {since}")["completed"] == 1)
    reset = counts(story, "--hours 1")["since"]
    last = counted_task(story, 5)
    story.expect_success(f"task start {last} --environment main", actor=story.agent)
    story.advance(timedelta(minutes=1))
    story.expect_success(f'task close {last} --outcome "Done" --environment main', actor=story.agent)
    story.expect_rows(counts(story, f"--since {reset}")["completed"] == 1, counts(story, "--hours 48")["completed"] == 2)

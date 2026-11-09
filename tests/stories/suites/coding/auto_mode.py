from core.testing.story_fixture import StoryFixture

import pytest

from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment


def task_pair(story):
    story.run('task make "Write the notes" --environment main --priority low', actor=story.agent)
    story.run('task make "Fix the totals" --environment main --priority high', actor=story.agent)


def started_holder(story, task_id: int) -> str:
    return story.run(f"task show {task_id}", actor=story.agent).output_text


def test_closing_the_task_in_hand_starts_the_most_urgent_open_one_for_the_same_agent(next_task_after_close):
    story = next_task_after_close
    expect_started_holder(story, 3, "state: started")
    expect_started_holder(story, 3, f"holder_id: {story.agent.id}")
    expect_started_holder(story, 2, "state: open")


@pytest.mark.parametrize("move", ['task cancel 1 --reason "not needed"', 'task block 1 --reason "waits for the price list"', 'task release 1 --reason "later"'])
def test_cancelling_blocking_or_releasing_the_task_in_hand_starts_the_next_too(new_story, move):
    story = new_story(fixture=PrioritizedTasks)
    story.expect_success(move, actor=story.agent)
    story.run_listeners()
    expect_started_holder(story, 3, "state: started")


def test_closing_a_task_with_another_in_hand_starts_a_critical_open_task_but_no_other(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run('task make "Second in hand" --environment main', actor=story.agent)
    story.run("task start 2", actor=story.agent)
    story.run('task make "Fix the totals" --environment main --priority high', actor=story.agent)
    story.run('task make "Stop the outage" --environment main --priority critical', actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    expect_started_holder(story, 4, "state: started")
    expect_started_holder(story, 3, "state: open")
    story.run('task close 4 --outcome "done"', actor=story.agent)
    story.run_listeners()
    expect_started_holder(story, 3, "state: open")
    expect_started_holder(story, 2, "state: started")


def test_closing_the_last_open_task_starts_nothing(closed_last_task):
    story = closed_last_task
    story.expect_no_text("task list --state started", "state: started", actor=story.agent)


def test_with_auto_mode_off_no_task_follows_the_one_that_left_the_hands(new_story):
    story = new_story(fixture=PrioritizedTasks)
    story.run("setting make journal.suites.coding.auto-mode false")
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    expect_started_holder(story, 3, "state: open")


def test_a_person_closing_a_task_gives_nothing_to_anyone_when_no_agent_held_it(next_task_after_release):
    story = next_task_after_release
    expect_started_holder(story, 3, "state: started")
    story.run('task make "An open one" --environment main', actor=story.agent)
    story.run('task close 4 --outcome "not needed"', actor=story.user)
    story.run_listeners()
    expect_started_holder(story, 2, "state: open")


def test_a_task_that_waits_on_an_open_task_is_not_given_next(new_story):
    story = new_story(fixture=PrioritizedTasks)
    story.run("task depend 3 --on 2", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    expect_started_holder(story, 2, "state: started")
    expect_started_holder(story, 3, "state: blocked")


def test_a_released_task_is_not_given_back_at_once(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task release 1 --reason "later"', actor=story.agent)
    story.run_listeners()
    expect_started_holder(story, 1, "state: open")
    expect_started_holder(story, 2, "state: started")


def test_a_task_queued_for_a_worker_is_not_started_for_the_main_agent(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    repository_environment(story)
    story.run('task make "Running at the worker" --environment main', actor=story.agent)
    story.run('task make "Queued at the worker" --environment main --priority critical', actor=story.agent)
    story.run('task make "Fix the totals" --environment main --priority high', actor=story.agent)
    worker = dispatched_worker(story, "worker dispatch --test-command python=pytest --model sonnet 2")
    story.expect_success(f"worker send --wait {worker.id} --task 3", actor=story.agent)
    story.expect_success('task release 1 --reason "later"', actor=story.agent)
    story.run_listeners()
    expect_started_holder(story, 3, "state: open")
    expect_started_holder(story, 3, f"delegated_to: {worker.id}")
    expect_started_holder(story, 4, f"holder_id: {story.agent.id}")


def test_closing_the_main_agents_task_hands_out_none_of_the_tasks_sent_to_a_kept_worker(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    repository_environment(story)
    story.run('task make "Running at the worker" --environment main', actor=story.agent)
    story.run('task make "First sent" --environment main --priority critical', actor=story.agent)
    story.run('task make "Second sent" --environment main --priority high', actor=story.agent)
    story.run('task make "Left for the main agent" --environment main', actor=story.agent)
    worker = dispatched_worker(story, "worker dispatch --test-command python=pytest --model sonnet 2")
    story.expect_success(f"worker send --wait {worker.id} --task 3 4", actor=story.agent)
    story.expect_success('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    for task_id in (3, 4):
        expect_started_holder(story, task_id, "state: open")
        expect_started_holder(story, task_id, f"delegated_to: {worker.id}")
    expect_started_holder(story, 5, f"holder_id: {story.agent.id}")


class PrioritizedTasks(StoryFixture):
    parent = StartedTaskBuilder

    def steps(self, story):
        task_pair(story)


@pytest.fixture
def next_task_after_close(new_story):
    story = new_story(fixture=PrioritizedTasks)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    return story


@pytest.fixture
def closed_last_task(new_story):
    story = new_story(fixture=StartedTaskBuilder)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    return story


@pytest.fixture
def next_task_after_release(new_story):
    story = new_story(fixture=PrioritizedTasks)
    story.run('task release 1 --reason "later"', actor=story.agent)
    story.run_listeners()
    return story


def expect_started_holder(story, task_id: int, expected) -> None:
    actual = started_holder(story, task_id)
    assert expected in actual, actual

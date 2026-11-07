from core.testing.story_fixture import StoryFixture

import pytest

from tests.stories.core.support.coding_fixtures import BuilderWithStartedTask


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
    story = new_story(fixture=BuilderWithStartedTask)
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
    story = new_story(fixture=BuilderWithStartedTask)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task release 1 --reason "later"', actor=story.agent)
    story.run_listeners()
    expect_started_holder(story, 1, "state: open")
    expect_started_holder(story, 2, "state: started")


class PrioritizedTasks(StoryFixture):
    parent = BuilderWithStartedTask

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
    story = new_story(fixture=BuilderWithStartedTask)
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

import json
from datetime import timedelta

import pytest

from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from core.base.query.queries import Queries
from core.modules.tasks.models.task_block_review import TaskBlockReview
from tests.stories.core.modules.tasks.task_waits import posted
from tests.stories.core.support.coding_fixtures import OpenTaskBuilder


class ManuallyBlockedTask(StoryFixture):
    parent = OpenTaskBuilder

    def steps(self, story):
        story.run('task block 1 --reason "Needs the price list"', actor=story.agent)

    def expect(self, story):
        story.expect_success("task show 1", "state: blocked")


def review(story):
    return story.hook("s-1", posted("journal task list"))


def expects_notice(story, text="review blocked task 1"):
    answer = review(story)
    assert any(text in line for line in answer.lines), answer
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def expectation_kept(story):
    answer = review(story)
    assert any("review blocked task 1" in line for line in answer.lines), answer
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "skip block")


def expect_review_absent(story):
    answer = review(story)
    assert not any("review blocked task" in line for line in answer.lines), answer


def pass_twice(story):
    for _ in range(2):
        story.clock.advance(timedelta(minutes=15))
        expects_notice(story)


def test_five_closed_tasks_bring_the_reminder_and_restart_the_span(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    for task_id in range(2, 7):
        story.clock.advance(timedelta(seconds=1))
        story.run(f'task make "Job {task_id}" --environment main', actor=story.agent)
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f"task close {task_id} --outcome done", actor=story.agent)
        if task_id < 6:
            expect_review_absent(story)
    expects_notice(story)
    story.clock.advance(timedelta(seconds=899))
    expect_review_absent(story)


def test_stops_bring_nothing(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    for _ in range(5):
        story.clock.advance(timedelta(seconds=1))
        story.hook("s-1", HookSamples.stop())
    expect_review_absent(story)


class ReminderPaused(StoryFixture):
    parent = ManuallyBlockedTask

    def steps(self, story):
        pass_twice(story)
        story.clock.advance(timedelta(minutes=15))
        expectation_kept(story)

    def expect(self, story):
        story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "skip block")


def test_the_reminder_passes_twice_and_holds_the_third_time(new_story):
    new_story(fixture=ReminderPaused)


@pytest.mark.parametrize("answer", ["task unblock 1", "task close 1 --outcome obsolete"])
def test_acting_on_the_task_releases_the_hold(new_story, answer):
    story = new_story(fixture=ReminderPaused)
    story.expect_success(answer, actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    story.clock.advance(timedelta(hours=1))
    expect_review_absent(story)


@pytest.mark.parametrize("answer", ['task block 1 --reason "The supplier still has not sent it"', 'agent-block skip 1 --reason "Nothing is needed before the supplier writes"'])
def test_a_renewal_or_a_reason_releases_the_hold_and_the_count_starts_over(new_story, answer):
    story = new_story(fixture=ReminderPaused)
    story.clock.advance(timedelta(minutes=45))
    story.expect_success(answer, actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    expect_review_absent(story)
    pass_twice(story)
    story.clock.advance(timedelta(minutes=15))
    expectation_kept(story)


def test_a_task_that_moved_between_reminders_starts_the_count_over(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    pass_twice(story)
    story.clock.advance(timedelta(minutes=14))
    story.run('task block 1 --reason "Still waiting for the list"', actor=story.agent)
    story.clock.advance(timedelta(minutes=15))
    expects_notice(story)
    story.clock.advance(timedelta(minutes=15))
    expects_notice(story)
    story.clock.advance(timedelta(minutes=15))
    expectation_kept(story)


def test_a_review_holds_until_each_task_has_been_answered(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    story.run('task make "Keys" --environment main', actor=story.agent)
    story.run('task block 2 --reason "Needs the key"', actor=story.agent)
    for _ in range(2):
        story.clock.advance(timedelta(minutes=15))
        expects_notice(story, "review blocked tasks 1, 2")
    story.clock.advance(timedelta(minutes=15))
    expect_line(review(story), "review blocked tasks 1, 2")
    story.run('task block 1 --reason "Still needs the list"', actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "review blocked task")
    story.run("task unblock 2", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_each_task_has_its_own_interval_and_firing_resets_it(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    story.clock.advance(timedelta(minutes=10))
    story.run('task make "Later keys" --environment main', actor=story.agent)
    story.run('task block 2 --reason "Needs the key"', actor=story.agent)
    story.clock.advance(timedelta(minutes=5))
    expects_notice(story, "review blocked task 1")
    story.run('task block 1 --reason "Still needs the list"', actor=story.agent)
    answer = review(story)
    expect_absent_line(answer, "review blocked task 2")
    story.clock.advance(timedelta(minutes=10))
    answer = review(story)
    expect_line(answer, "review blocked task 2")
    expect_absent_line(answer, "review blocked task 1")


def test_an_automatic_wait_is_excluded_even_after_all_the_triggers(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.run('task make "Keys" --environment main', actor=story.agent)
    story.run("task block 1 --on task:2", actor=story.agent)
    story.run("task block 2 --until 'false'", actor=story.agent)
    story.clock.advance(timedelta(hours=2))
    for task_id in range(3, 8):
        story.run(f'task make "Automatic wait job {task_id}" --environment main', actor=story.agent)
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f"task close {task_id} --outcome done", actor=story.agent)
    expect_review_absent(story)


def test_a_user_wait_is_reminded_twice_and_held_the_third_time_until_answered(new_story):
    story = new_story(fixture=OpenTaskBuilder)
    story.run('task block 1 --until-user --reason "Publish the release"', actor=story.agent)
    story.clock.advance(timedelta(minutes=15))
    expect_line(review(story), "task 1 waits on the user")
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    expect_review_absent(story)
    story.clock.advance(timedelta(minutes=15))
    expect_line(review(story), "task 1 waits on the user")
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    story.clock.advance(timedelta(minutes=15))
    expect_line(review(story), "task 1 waits on the user")
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "skip block")
    story.expect_success('agent-block skip 1 --reason "The user was told and has not answered"', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


class ManyUserWaits(StoryFixture):
    parent = OpenTaskBuilder

    def steps(self, story):
        for task_id in range(1, 32):
            if task_id != 1:
                story.run(f'task make "Approval {task_id}" --environment main', actor=story.agent)
            story.run(f'task block {task_id} --until-user --reason "Approve the release"', actor=story.agent)


@pytest.fixture
def reviewed_user_waits(new_story):
    story = new_story(fixture=ManyUserWaits)
    story.clock.advance(timedelta(minutes=15))
    return story, review(story)


def test_all_due_user_waits_share_one_line_and_each_review_is_recorded(reviewed_user_waits):
    story, answer = reviewed_user_waits
    ids = ", ".join(str(task_id) for task_id in range(1, 32))
    expect_matching_lines(answer, "wait on the user", [f"tasks {ids} wait on the user: tell the user what is still needed"])
    rows = list(story.container.get(Queries).query(TaskBlockReview).all_rows())
    expect_reviewed_rows(rows, story.clock.timestamp())
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    expect_absent_line(review(story), "wait on the user")
    story.clock.advance(timedelta(minutes=15))
    expect_matching_lines(review(story), "wait on the user", [f"tasks {ids} wait on the user: tell the user what is still needed"])


class MixedBlockReviews(StoryFixture):
    parent = ManuallyBlockedTask

    def steps(self, story):
        for task_id in range(2, 5):
            story.run(f'task make "Approval {task_id}" --environment main', actor=story.agent)
            user_wait = "--until-user " if task_id > 2 else ""
            story.run(f'task block {task_id} {user_wait}--reason "Approve the release"', actor=story.agent)


def test_manual_reviews_and_user_waits_each_get_their_own_plural_line(new_story):
    story = new_story(fixture=MixedBlockReviews)
    story.clock.advance(timedelta(minutes=15))
    answer = review(story)
    expect_matching_lines(answer, "review blocked tasks", ['review blocked tasks 1, 2: renew each block with a reason, unblock it, or close it'])
    expect_matching_lines(answer, "wait on the user", ["tasks 3, 4 wait on the user: tell the user what is still needed"])
    story.run('task block 1 --reason "Still needs the list"', actor=story.agent)
    story.run("task unblock 2", actor=story.agent)
    expect_matching_lines(review(story), "review blocked tasks", [])
    expect_absent_line(review(story), "wait on the user")


@pytest.mark.parametrize("reason", ["", '--reason "  "'])
def test_a_renewal_without_a_written_reason_is_refused(new_story, reason):
    story = new_story(fixture=ManuallyBlockedTask)
    story.expect_refusal(f"task block 1 {reason}", "say what it waits on", actor=story.agent)


def test_the_inspector_keeps_every_block_reason_and_its_time(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    for reason in ("The supplier is checking", "Delivery is now tomorrow"):
        story.clock.advance(timedelta(hours=1))
        story.expect_success(f'task block 1 --reason "{reason}"', actor=story.agent)
    data = json.loads(story.run("task inspect 1 --json").output_text)
    expect_block_history(data)


def expect_block_history(data):
    history = data["block_renewals"]
    assert [row["reason"] for row in history] == [
        "Needs the price list", "The supplier is checking", "Delivery is now tomorrow",
    ]
    assert len({row["created_at"] for row in history}) == 3


def expect_line(answer, text):
    assert any(text in line for line in answer.lines), answer


def expect_absent_line(answer, text):
    assert not any(text in line for line in answer.lines), answer


def expect_matching_lines(answer, text, expected):
    assert [line for line in answer.lines if text in line] == expected, answer


def expect_reviewed_rows(rows, reviewed_at):
    assert len(rows) == 31
    assert all(row.reviewed_at == reviewed_at for row in rows)

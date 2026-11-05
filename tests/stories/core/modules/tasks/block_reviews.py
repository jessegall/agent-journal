import json
from datetime import timedelta

import pytest

from core.testing.hook_samples import HookSamples
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.tasks.task_waits import posted
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask


class ManuallyBlockedTask(StoryFixture):
    parent = BuilderWithOpenTask

    def steps(self, story):
        story.run('task block 1 --reason "Needs the price list"', actor=story.agent)

    def expect(self, story):
        story.expect_success("task show 1", "state: blocked")


def review(story):
    return story.hook("s-1", posted("journal task list"))


def expects_review(story):
    answer = review(story)
    assert any("review blocked task 1" in line for line in answer.lines), answer
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "review blocked task 1")
    story.expect_hook_refusal("s-1", HookSamples.stop(), "review blocked task 1")


def expect_review_absent(story):
    answer = review(story)
    assert not any("review blocked task" in line for line in answer.lines), answer


def test_an_hour_holds_the_agent_until_it_renews_with_a_reason(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    story.clock.advance(timedelta(seconds=3599))
    expect_review_absent(story)
    story.clock.advance(timedelta(seconds=1))
    expects_review(story)
    story.expect_success('task block 1 --reason "The supplier still has not sent it"', actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    expect_review_absent(story)
    story.clock.advance(timedelta(hours=1))
    expects_review(story)


def test_five_closed_tasks_fire_and_restart_every_span(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    for task_id in range(2, 7):
        story.clock.advance(timedelta(seconds=1))
        story.run(f'task make "Job {task_id}" --environment main', actor=story.agent)
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f"task close {task_id} --outcome done", actor=story.agent)
        if task_id < 6:
            expect_review_absent(story)
    expects_review(story)
    story.run('task block 1 --reason "Still waiting for the list"', actor=story.agent)
    story.clock.advance(timedelta(seconds=3599))
    expect_review_absent(story)
    story.clock.advance(timedelta(seconds=1))
    expects_review(story)


def test_five_stops_fire_the_review(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    for count in range(5):
        story.clock.advance(timedelta(seconds=1))
        story.hook("s-1", HookSamples.stop())
        if count < 4:
            expect_review_absent(story)
    expects_review(story)


class BlockReviewDue(StoryFixture):
    parent = ManuallyBlockedTask

    def steps(self, story):
        story.clock.advance(timedelta(hours=1))
        expects_review(story)


@pytest.mark.parametrize("answer", ["task unblock 1", "task close 1 --outcome obsolete"])
def test_unblocking_or_closing_answers_the_review(new_story, answer):
    story = new_story(fixture=BlockReviewDue)
    story.expect_success(answer, actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    story.clock.advance(timedelta(hours=1))
    expect_review_absent(story)


def test_a_review_holds_until_each_task_has_been_answered(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    story.run('task make "Keys" --environment main', actor=story.agent)
    story.run('task block 2 --reason "Needs the key"', actor=story.agent)
    story.clock.advance(timedelta(hours=1))
    expects_review(story)
    story.run('task block 1 --reason "Still needs the list"', actor=story.agent)
    story.expect_hook_refusal("s-1", HookSamples.edit("src/cart.py"), "review blocked task")
    story.run("task unblock 2", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))


def test_each_task_has_its_own_interval_and_firing_resets_it(new_story):
    story = new_story(fixture=ManuallyBlockedTask)
    story.clock.advance(timedelta(minutes=30))
    story.run('task make "Later keys" --environment main', actor=story.agent)
    story.run('task block 2 --reason "Needs the key"', actor=story.agent)
    story.clock.advance(timedelta(minutes=30))
    expects_review(story)
    story.run('task block 1 --reason "Still needs the list"', actor=story.agent)
    answer = review(story)
    expect_absent_line(answer, "review blocked task 2")
    story.clock.advance(timedelta(minutes=30))
    answer = review(story)
    expect_line(answer, "review blocked task 2")
    expect_absent_line(answer, "review blocked task 1")


def test_an_automatic_wait_is_excluded_even_after_all_three_triggers(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.run('task make "Keys" --environment main', actor=story.agent)
    story.run("task block 1 --on task:2", actor=story.agent)
    story.run("task block 2 --until 'false'", actor=story.agent)
    story.clock.advance(timedelta(hours=2))
    for task_id in range(3, 8):
        story.run(f'task make "Automatic wait job {task_id}" --environment main', actor=story.agent)
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f"task close {task_id} --outcome done", actor=story.agent)
    for _ in range(5):
        story.hook("s-1", HookSamples.stop())
    expect_review_absent(story)


def test_a_user_wait_asks_for_a_line_but_does_not_hold_the_agent(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    story.run('task block 1 --until-user --reason "Publish the release"', actor=story.agent)
    story.clock.advance(timedelta(hours=1))
    answer = review(story)
    expect_line(answer, "task 1 waits on the user")
    story.expect_hook_allowed("s-1", HookSamples.edit("src/cart.py"))
    expect_review_absent(story)


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

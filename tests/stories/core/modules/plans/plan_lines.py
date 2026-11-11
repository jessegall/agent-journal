from engine.testing.stories.story_fixture import StoryFixture

import pytest

from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.engine.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.engine.driver.support.samples import SAMPLES
from engine.testing.expectations.expect_reply import expect_absent_reply_line
from tests.stories.support.story_checks import expect_lines_3, expect_value_with, expect_value_without_line
from tests.stories.core.support.plan_steps import ready_plan


def task_end(task_id):
    line = f"journal task close {task_id}"
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand="task")).with_fields(event="post_tool_use", raw={"tool_input": {"command": line}})


VIEW_LINE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")


class CartPlan(StoryFixture):
    parent = UserBuilder
    checkpoint = False

    def steps(self, story):
        story.run('plan make "Cart plan" --environment main')
        story.run(f'''phase make --plan 1 "Build"{(' --checkpoint' if self.checkpoint else '')}''')
        story.run('phase make --plan 1 "Ship"')
        for title, phase in (('Cart', 1), ('Release', 2)):
            task_id = story.new_row_id(f'task make "{title}" --brief "{title} well" --environment main')
            story.run(f'phase place {task_id} --phase {phase}')
        ready_plan(story, actor=story.user)
        for move in ('approve', 'start'):
            story.run(f'plan {move} 1 --environment main', actor=story.user)


class CheckpointCartPlan(CartPlan):
    checkpoint = True


def closed_lines(story, task_id):
    story.expect_success(f'task close {task_id} --outcome "done"', "state: completed", actor=story.agent)
    return story.hook("s-1", task_end(task_id)).lines


def test_ending_a_task_names_the_task_now_in_hand_once_and_the_phase_it_ended(completed_cart_phase):
    story, lines = completed_cart_phase
    expect_lines_3(lines, "task:2", ["back to task:2: carry on, close it, or release it"])
    expect_value_with(lines, "plan 1: phase Build done")


def test_a_checkpoint_phase_says_the_phases_after_it_wait_for_its_tests(new_story):
    story = new_story(fixture=CheckpointCartPlan)
    story.expect_success("task start 1", "state: started", actor=story.agent)
    expect_closed_lines(story, 1, "plan 1: phase Build done, a checkpoint: the phases after it wait for its tests")


def test_the_last_task_says_the_plan_is_done(completed_cart_phase):
    story, _ = completed_cart_phase
    expect_closed_lines(story, 2, "plan 1 done: run the final suite; merging to main and releasing wait for the user's word")


def test_a_plan_whose_tasks_cannot_start_says_so(started_cart_plan):
    story = started_cart_plan
    story.run('task block 2 --reason "waits for a key"')
    lines = closed_lines(story, 1)
    expect_value_with(lines, "plan 1: no task can start; 1 wait or are blocked: task 2, which is blocked with a reason")
    expect_value_with(lines, "plan 1: phase Build done")


def test_a_task_refused_its_close_says_nothing(started_cart_plan):
    story = started_cart_plan
    story.expect_absent_hook_line("s-1", task_end(1), "is in hand")


def test_a_plan_approved_or_cancelled_since_the_last_hook_is_named(new_story):
    story = new_story(fixture=ReadyCartPlan)
    story.advance(timedelta(seconds=1))
    story.run("plan approve 1 --environment main", actor=story.user)
    story.expect_hook_allowed("s-1", VIEW_LINE, "plan 1 approved")
    story.advance(timedelta(seconds=1))
    story.expect_absent_hook_line("s-1", VIEW_LINE, "plan 1 approved")
    story.advance(timedelta(seconds=1))
    story.run('plan cancel 1 --reason "not needed"')
    story.expect_hook_allowed("s-1", VIEW_LINE, "plan:1 is cancelled")


def test_a_new_main_session_is_told_it_is_a_new_session_and_a_session_again_is_not(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    first = story.hook("s-1", HookSamples.session_start())
    expect_absent_reply_line(first, "You are a new session")
    story.expect_hook_allowed("s-2", HookSamples.session_start(), "You are a new session of agent")
    story.hook("s-2", VIEW_LINE)
    story.expect_absent_hook_line("s-2", HookSamples.session_start(), "You are a new session")


def test_blocking_another_task_does_not_repeat_the_task_already_in_hand(started_cart_plan):
    story = started_cart_plan
    story.run('task make "Other" --environment main')
    story.advance(timedelta(seconds=1))
    story.run('task block 3 --reason "needs a key"')
    line = "journal task block 3"
    sample = HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand="task")).with_fields(event="post_tool_use")
    story.expect_absent_hook_line("s-1", sample, "is in hand")


def test_a_plan_with_a_task_still_in_hand_is_not_stalled(started_cart_plan):
    story = started_cart_plan
    story.run('task make "Second" --environment main')
    story.run("phase place 3 --phase 1")
    story.expect_success("task start 3", "state: started", actor=story.agent)
    lines = closed_lines(story, 1)
    expect_value_without_line(lines, "no task can start")


def test_a_plan_approved_with_no_tool_running_is_named_on_the_next_call(new_story):
    story = new_story(fixture=ReadyCartPlan)
    story.advance(timedelta(seconds=30))
    story.run("plan approve 1 --environment main", actor=story.user)
    story.advance(timedelta(seconds=30))
    story.hook("s-1", HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])))
    story.expect_hook_allowed("s-1", VIEW_LINE, "plan 1 approved")


@pytest.fixture
def started_cart_plan(new_story):
    story = new_story(fixture=CartPlan)
    story.expect_success("task start 1", "state: started", actor=story.agent)
    return story


class ReadyCartPlan(StoryFixture):
    parent = UserBuilder

    def steps(self, story):
        story.run('plan make "Cart plan" --environment main')
        story.run('phase make --plan 1 "Build"')
        story.run('task make "Cart" --environment main')
        story.run('phase place 1 --phase 1')
        ready_plan(story)
        story.hook('s-1', VIEW_LINE)


@pytest.fixture
def completed_cart_phase(started_cart_plan):
    return started_cart_plan, closed_lines(started_cart_plan, 1)


def expect_closed_lines(story, task_id, expected) -> None:
    actual = closed_lines(story, task_id)
    assert expected in actual, actual

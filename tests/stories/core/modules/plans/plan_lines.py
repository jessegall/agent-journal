from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.base.driver.support.fixtures import SampleSuiteChoice
from tests.stories.core.base.driver.support.hook_agents import hook_agent
from tests.stories.core.base.driver.support.samples import SAMPLES


def task_end(task_id):
    line = f"journal task close {task_id}"
    return HookSamples.shell(line, ShellPart("journal", CommandCategory.JOURNAL, line.split()[1:], subcommand="task")).with_fields(event="post_tool_use")


LOOK = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")


def plan_story(new_story, checkpoint=False):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run('plan make "Cart plan" --environment main')
    story.run(f'phase make --plan 1 "Build"{" --checkpoint" if checkpoint else ""}')
    story.run('phase make --plan 1 "Ship"')
    for title, phase in (("Cart", 1), ("Release", 2)):
        task_id = story.new_row_id(f'task make "{title}" --brief "{title} well" --environment main')
        story.run(f"phase place {task_id} --phase {phase}")
    for move in ("ready", "approve", "start"):
        story.run(f"plan {move} 1")
    return story


def closed_lines(story, task_id):
    story.expect_success(f'task close {task_id} --outcome "done"', "state: completed", actor=story.agent)
    return story.hook("s-1", task_end(task_id)).lines


def test_ending_a_task_names_the_task_now_in_hand_with_its_brief_and_the_phase_it_ended(new_story):
    story = plan_story(new_story)
    story.expect_success("task start 1", "state: started", actor=story.agent)
    lines = closed_lines(story, 1)
    assert "task 2, Release, is in hand in plan 1: Release well" in lines
    assert "plan 1: phase Build done" in lines


def test_a_checkpoint_phase_says_to_wait_for_the_users_word(new_story):
    story = plan_story(new_story, checkpoint=True)
    story.expect_success("task start 1", "state: started", actor=story.agent)
    assert "plan 1: phase Build done, a checkpoint: tell the user and wait for their word" in closed_lines(story, 1)


def test_the_last_task_says_the_plan_is_done(new_story):
    story = plan_story(new_story)
    story.expect_success("task start 1", "state: started", actor=story.agent)
    closed_lines(story, 1)
    assert "plan 1 done: run the final suite; merging to main and releasing wait for the user's word" in closed_lines(story, 2)


def test_a_plan_whose_tasks_cannot_start_says_so(new_story):
    story = plan_story(new_story)
    story.expect_success("task start 1", "state: started", actor=story.agent)
    story.run('task block 2 --reason "waits for a key"')
    lines = closed_lines(story, 1)
    assert "plan 1: no task can start; 1 wait or are blocked" in lines
    assert "plan 1: phase Build done" in lines


def test_a_task_refused_its_close_says_nothing(new_story):
    story = plan_story(new_story)
    story.expect_success("task start 1", "state: started", actor=story.agent)
    story.expect_absent_hook_line("s-1", task_end(1), "is in hand")


def test_a_plan_approved_or_cancelled_since_the_last_hook_is_named(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    story.agent = hook_agent(story, story.hook("s-1", HookSamples.session_start()))
    story.run('plan make "Cart plan" --environment main')
    story.run('phase make --plan 1 "Build"')
    story.run('task make "Cart" --environment main')
    story.run("phase place 1 --phase 1")
    story.run("plan ready 1")
    story.hook("s-1", LOOK)
    story.advance(timedelta(seconds=1))
    story.run("plan approve 1")
    assert "plan 1 approved" in story.hook("s-1", LOOK).lines
    story.advance(timedelta(seconds=1))
    story.expect_absent_hook_line("s-1", LOOK, "plan 1 approved")
    story.advance(timedelta(seconds=1))
    story.run('plan cancel 1 --reason "not needed"')
    assert "plan 1 cancelled: not needed" in story.hook("s-1", LOOK).lines


def test_a_new_main_session_is_told_it_took_over_and_a_session_again_is_not(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    first = story.hook("s-1", HookSamples.session_start())
    assert not any("you took over" in line for line in first.lines)
    assert any("you took over from agent" in line for line in story.hook("s-2", HookSamples.session_start()).lines)
    story.hook("s-2", LOOK)
    story.expect_absent_hook_line("s-2", HookSamples.session_start(), "you took over")


def test_a_session_start_names_the_laws(new_story):
    story = new_story(SAMPLES, fixture=SampleSuiteChoice)
    assert "the laws L1 to L10 in AGENTS.md apply to you" in story.hook("s-1", HookSamples.session_start()).lines

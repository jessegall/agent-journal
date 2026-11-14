from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from tests.stories.core.modules.plans.support.started_plans import ThreeStartedPlans
from tests.stories.core.support.plan_steps import started_plan
from tests.stories.support.story_checks import expect_value_with, expect_value_without_line
from core.modules.plans.support.plan_nudges import FOCUS_SUGGESTED
from core.modules.plans.support.plan_nudges import PLAN_STALLED
from core.modules.plans.support.plan_nudges import UNFOCUSED_TASK

SUGGESTION = FOCUS_SUGGESTED.nudge(plans='1, 2, 3', focus=1).text
VIEW_LINE = HookSamples.shell("ls", ShellPart("ls", CommandCategory.READ, [])).with_fields(event="post_tool_use")


def journal_line(line):
    sample = HookSamples.shell(f"journal {line}", ShellPart("journal", CommandCategory.JOURNAL, line.split(), subcommand=line.split()[0]))
    return sample.with_fields(event="post_tool_use", raw={"tool_input": {"command": f"journal {line}"}})


def lines_after(story, line):
    story.advance(timedelta(seconds=1))
    story.expect_success(line, actor=story.agent)
    story.advance(timedelta(seconds=1))
    return story.hook("s-1", journal_line(line)).lines


def test_d1_d6_an_agent_with_no_focus_of_its_own_that_starts_a_plan_task_reads_the_started_plans_and_the_default_once(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    expect_value_with(lines_after(story, "task start 1"), SUGGESTION)
    story.advance(timedelta(seconds=1))
    expect_value_without_line(story.hook("s-1", VIEW_LINE).lines, SUGGESTION)


def test_d2_d3_an_agent_with_a_focus_reads_a_line_for_a_task_of_another_plan_and_none_for_one_the_focus_waits_on(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    story.run("task depend 5 --on 4", actor=story.user)
    expect_value_with(lines_after(story, "task start 1"), UNFOCUSED_TASK.nudge(task=1, plan=1, focus=3).text)
    expect_value_without_line(lines_after(story, "task start 4"), UNFOCUSED_TASK.nudge(task=4, plan=2, focus=3).text)


def test_d5_a_task_outside_any_plan_gives_no_line(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    task_id = story.new_row_id('task make "Loose job" --environment main', actor=story.user)
    lines = lines_after(story, f"task start {task_id}")
    expect_value_without_line(lines, SUGGESTION)
    expect_value_without_line(lines, f"Task {task_id} belongs to plan")


def test_d8_starting_a_plan_while_others_are_started_names_the_started_plans(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    started_plan(story, 4, "Yard")
    lines = story.hook("s-1", journal_line("plan start 4")).lines
    expect_value_with(lines, FOCUS_SUGGESTED.nudge(plans='1, 2, 3, 4', focus=1).text)


def test_c10_a_plan_with_nothing_that_can_start_names_each_task_it_waits_on(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run('task block 2 --until-user --reason "Ada signs"', actor=story.user)
    story.expect_success("task start 1", actor=story.agent)
    story.run('task block 1 --reason "waits for a key"', actor=story.agent)
    lines = story.hook("s-1", journal_line("task block 1")).lines
    expect_value_with(lines, PLAN_STALLED.nudge(plan=1, count=2, waits=': task 1, which is blocked with a reason; task 2, which waits on a user').text)

import pytest

from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

OUTWARD = "reaches past the journal"


def journal_line(*arguments: str):
    return HookSamples.shell("journal " + " ".join(arguments), ShellPart("journal", CommandCategory.JOURNAL, list(arguments), subcommand=arguments[0])).with_fields(event="pre_tool_use")


def test_a_read_only_helper_gets_a_usage_error_for_a_subcommand_that_does_not_exist(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_hook_allowed(helper.session, journal_line("task", "nosuch"))
    story.expect_hook_allowed(helper.session, journal_line("doc", "delete", "1"))
    outcome = story.run("task nosuch", Actor(helper.id, ActorType.AGENT))
    story.expect_rows(outcome.code != 0, "task has no subcommand nosuch" in outcome.output_text)


def test_a_read_only_helper_is_still_refused_a_command_that_writes(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    story.expect_hook_refusal(helper.session, journal_line("task", "delete", "1"), OUTWARD)
    story.expect_hook_refusal(helper.session, journal_line("task", "close", "1"), OUTWARD)



@pytest.fixture
def helper_story(new_story):
    story = new_story(fixture=StartedHelper)
    helper = helper_agent(story)
    helper_actor = Actor(helper.id, ActorType.AGENT)
    story.expect_success('plan make "Own plan" --environment main', actor=helper_actor)
    story.expect_success('phase make --plan 1 "Build"', actor=helper_actor)
    return story, helper


def test_a_planner_helper_edits_links_and_readies_only_the_plan_it_made(helper_story):
    story, helper = helper_story
    helper_actor = Actor(helper.id, ActorType.AGENT)
    first_task = story.new_row_id('task make "First" --phase 1', actor=helper_actor)
    second_task = story.new_row_id('task make "Second" --phase 1', actor=helper_actor)
    story.expect_success('plan make "Other plan" --environment main', actor=story.agent)
    story.expect_success('phase make --plan 2 "Build"', actor=story.agent)
    second_plan_task = story.new_row_id('task make "Other" --phase 2', actor=story.agent)
    for arguments in (("task", "edit", str(first_task), "--complexity", "2"), ("task", "depend", str(second_task), "--on", str(first_task)),
                  ("task", "comment", str(first_task), "Read doc 1 first"), ("phase", "edit", "1", "--goal", "It builds"), ("plan", "ready", "1")):
        story.expect_hook_allowed(helper.session, journal_line(*arguments))
    for arguments in (("task", "depend", str(second_plan_task), "--on", str(first_task)), ("plan", "ready", "2")):
        story.expect_hook_refusal(helper.session, journal_line(*arguments), OUTWARD)


def test_a_planner_helper_line_with_two_parts_for_one_plan_reads_that_plan_once(helper_story):
    story, helper = helper_story
    ready = ShellPart("journal", CommandCategory.JOURNAL, ["plan", "ready", "1"], subcommand="plan")
    edit = ShellPart("journal", CommandCategory.JOURNAL, ["phase", "edit", "1", "--goal", "It builds"], subcommand="phase")
    line = HookSamples.shell("journal phase edit 1 --goal 'It builds' && journal plan ready 1", edit, ready).with_fields(event="pre_tool_use")
    with story.repeated_work.request():
        story.expect_hook_allowed(helper.session, line)

import pytest

from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.helpers.helper_jobs import StartedHelper, helper_agent

OUTWARD = "reaches past the journal"


def journal_line(*arguments: str):
    return HookSamples.shell("journal " + " ".join(arguments), ShellPart("journal", CommandCategory.JOURNAL, list(arguments), subcommand=arguments[0])).with_fields(event="pre_tool_use")


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


def test_a_planner_helper_line_editing_many_tasks_of_its_plan_reads_the_tasks_once(helper_story):
    story, helper = helper_story
    helper_actor = Actor(helper.id, ActorType.AGENT)
    tasks = [story.new_row_id(f'task make "Step {number}" --phase 1', actor=helper_actor) for number in range(12)]
    parts = [ShellPart("journal", CommandCategory.JOURNAL, ["task", "edit", str(task), "--complexity", "2"], subcommand="task") for task in tasks]
    line = HookSamples.shell(" && ".join(f"journal task edit {task} --complexity 2" for task in tasks), *parts).with_fields(event="pre_tool_use")
    with story.repeated_work.request():
        story.expect_hook_allowed(helper.session, line)

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


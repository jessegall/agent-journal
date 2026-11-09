from core.base.driver.command_category import CommandCategory
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.documents.support.trail_fixtures import viewer
from tests.stories.core.modules.processes.support.process_samples import install_runner
from tests.stories.core.support.coding_fixtures import BuilderHelper, BuilderStarted

OVERVIEW = HookSamples.shell("journal overview", ShellPart("journal", CommandCategory.JOURNAL, ["overview"], subcommand="overview"))


def card_lines(story, session: str) -> list[str]:
    reply = story.hook(session, OVERVIEW)
    folder = story.container.get(OutputFolder)
    folder.write_start(1, "journal overview", ["journal overview"])
    folder.write_output(1, 1, "## skill required\nno skills to load\n")
    return viewer(story, "agents.agents", ["output", "hook-page", str(reply.hook_call_id)])["lines"]


def test_the_card_of_a_main_agent_shows_the_output_of_journal_overview(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_rows(card_lines(story, "s-1") == ["## skill required", "no skills to load"])


def test_the_card_of_a_helper_shows_the_output_of_journal_overview(new_story):
    story = install_runner(new_story(fixture=BuilderHelper))
    story.expect_rows(card_lines(story, "sub-1") == ["## skill required", "no skills to load"])

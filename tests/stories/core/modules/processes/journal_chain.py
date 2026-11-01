from core.base.driver.command_category import CommandCategory
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from tests.stories.core.modules.processes.support.process_samples import install_runner, runner_line
from tests.stories.core.support.coding_fixtures import BuilderStarted

JOURNAL_PART = ShellPart("journal", CommandCategory.JOURNAL, ["task", "show", "1"], subcommand="task")
LISTING_PART = ShellPart("ls", CommandCategory.SEARCH, ["build"])
REFUSAL = "journal commands must come first in a line"


def test_a_journal_command_after_another_command_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", HookSamples.shell("ls build && journal task show 1", LISTING_PART, JOURNAL_PART), REFUSAL)


def test_a_journal_command_after_journal_and_another_command_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.expect_hook_refusal("s-1", HookSamples.shell("journal task show 1 && ls build && journal task show 1", JOURNAL_PART, LISTING_PART, JOURNAL_PART), REFUSAL)


def test_a_journal_command_inside_a_loop_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    loop = ShellPart("for", CommandCategory.PROCESS, ["i"])
    story.expect_hook_refusal("s-1", HookSamples.shell("for i in 1 2; do journal task show 1; done", loop), REFUSAL)


def test_journal_commands_first_and_then_other_commands_go_on_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "journal task show 1 && journal task show 1 && ls build"
    reply = story.hook("s-1", HookSamples.shell(line, JOURNAL_PART, JOURNAL_PART, LISTING_PART))
    assert dict(reply.updated_input) == {"command": runner_line(story, 1, line)}


def test_a_loop_that_only_names_a_path_with_journal_in_it_goes_on_through_the_runner(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    line = "for f in .journal/a; do cat $f; done"
    reply = story.hook("s-1", HookSamples.shell(line, ShellPart("for", CommandCategory.PROCESS, ["f"])))
    assert dict(reply.updated_input) == {"command": runner_line(story, 1, line)}


def test_a_sleep_poll_followed_by_another_command_is_refused(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    loop = ShellPart("until", CommandCategory.PROCESS, ["pgrep"])
    story.expect_hook_refusal("s-1", HookSamples.shell("until pgrep -f build; do sleep 5; done && ls build", loop, LISTING_PART), "a sleep with nothing to wait on is refused")

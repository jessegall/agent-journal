from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.ticks.silent_alias_marking import SilentAliasMarking
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from core.testing.story_fixture import StoryFixture
from tests.stories.core.modules.aliases.saved_commands import BuildSaved, hook_of
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run

NOTHING = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
SILENT_LINE = "alias build-npm printed nothing for 30 seconds: make it print each step; this run stays silent, the next shows its steps"
REFUSAL = "alias build-npm printed nothing for 30 seconds on its last run: edit it to print each step, then run it again"
RUN = "journal build-npm --tail 5"


class SilentBuildRun(StoryFixture):
    """The saved build build-npm ran in the background and printed nothing for 31 seconds, and its alias is marked silent."""

    parent = BuildSaved

    def steps(self, story: Story) -> None:
        install_runner(story)
        moved_run(story, RUN, category=CommandCategory.BUILD)
        story.advance(timedelta(seconds=31))
        SilentAliasMarking()(story.container)


def alias_of(story: Story) -> Alias:
    return story.container.get(AliasQuery).saved("build-npm")


def test_a_silent_saved_command_is_named_by_its_alias_and_told_its_next_run_shows_the_fix(new_story):
    story = new_story(fixture=SilentBuildRun)
    story.expect_hook_allowed("s-1", NOTHING, SILENT_LINE)


def test_a_silent_saved_command_marks_its_alias_silent_once_and_unmarked_runs_do_not(new_story):
    story = new_story(fixture=BuildSaved)
    install_runner(story)
    moved_run(story, RUN, category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=10))
    SilentAliasMarking()(story.container)
    assert alias_of(story).silent_at is None
    story.advance(timedelta(seconds=21))
    SilentAliasMarking()(story.container)
    assert alias_of(story).is_held


def test_the_next_run_of_a_silent_alias_is_refused_until_the_alias_is_edited(new_story):
    story = new_story(fixture=SilentBuildRun)
    for hook in hook_of(story, {"build-npm": "npm run build"}):
        hook.expect_denied(RUN, REFUSAL)
        story.expect_success('alias edit build-npm --line "npm run build --verbose"', actor=story.agent)
        story.run_listeners()
        hook.expect_expanded(RUN, "npm run build --verbose")


def test_an_edited_alias_whose_run_prints_clears_its_mark(new_story):
    story = new_story(fixture=SilentBuildRun)
    story.expect_success('alias edit build-npm --line "npm run build --verbose"', actor=story.agent)
    assert alias_of(story).fixed_at is not None and not alias_of(story).is_held
    process = moved_run(story, RUN, category=CommandCategory.BUILD)
    story.container.get(OutputFolder).write_output(process.id, 1, "step 1\n")
    SilentAliasMarking()(story.container)
    cleared = alias_of(story)
    assert cleared.silent_at is None and cleared.fixed_at is None


def test_an_edited_alias_whose_run_stays_silent_is_held_again(new_story):
    story = new_story(fixture=SilentBuildRun)
    story.expect_success('alias edit build-npm --line "npm run build --verbose"', actor=story.agent)
    moved_run(story, RUN, category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=31))
    SilentAliasMarking()(story.container)
    assert alias_of(story).is_held


def test_an_edit_that_leaves_the_line_alone_does_not_free_a_silent_alias(new_story):
    story = new_story(fixture=SilentBuildRun)
    story.expect_success('alias edit build-npm --about "builds the web files"', actor=story.agent)
    assert alias_of(story).is_held


def test_a_silent_go_test_over_several_packages_is_told_why_and_how_to_fix_it(new_story):
    story = new_story(fixture=BuildSaved)
    story.expect_success('alias add gotest "go test ./..." --category "test run"', actor=story.agent)
    install_runner(story)
    moved_run(story, "journal gotest --tail 5", category=CommandCategory.TEST_RUN)
    story.advance(timedelta(seconds=31))
    story.expect_hook_allowed("s-1", NOTHING, "alias gotest printed nothing for 30 seconds: go test over several packages holds back each package's output until it is done, so run one package at a time, or with -p 1")

from datetime import timedelta

from engine.command.bus import Bus
from engine.enums.command_category import CommandCategory
from core.modules.aliases.models.alias import Alias
from core.modules.aliases.queries.alias_query import AliasQuery
from core.modules.aliases.ticks.silent_alias_marking import SilentAliasMarking
from core.modules.processes.commands.move_process.move_process import MoveProcess
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.support.part_spec import PartSpec
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_folder import OutputFolder
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.story import Story
from tests.stories.core.modules.aliases.saved_commands import BuildSaved, read_hook
from tests.stories.core.modules.processes.support.cadence_probe import cadence_tick
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, parts_started
from tests.stories.support.story_checks import expect_value
from core.modules.processes.support.process_nudges import SILENT_SAVED_RUN
from engine.testing.expectations.expected_nudge import expected_nudge
from core.modules.aliases.support.alias_nudges import SAVED_COMMAND_SILENT

READ_NOTES = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"]))
SILENT_LINE = expected_nudge(SILENT_SAVED_RUN, name='build-npm', seconds=30)
PACKAGES_LINE = "Alias gotest printed nothing for 30s: go test holds each package's output until it is done, so run one package at a time or with -p 1"
REFUSAL = SAVED_COMMAND_SILENT.nudge(name="build-npm").text
RUN = "journal build-npm --tail 5"
EDITED_LINE = "npm run build --verbose"


def read_alias(story: Story) -> Alias:
    return story.container.get(AliasQuery).saved("build-npm")


def silent_run(new_story) -> Story:
    story = install_runner(new_story(fixture=BuildSaved))
    moved_run(story, RUN, category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=31))
    SilentAliasMarking()(story.container)
    return story


def edited_alias(story: Story, line: str = EDITED_LINE) -> None:
    story.expect_success(f'alias edit build-npm --line "{line}"', actor=story.agent)


def test_a_silent_saved_command_is_named_by_its_alias_and_told_its_next_run_shows_the_fix(new_story):
    story = install_runner(new_story(fixture=BuildSaved))
    moved_run(story, RUN, category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=30))
    cadence_tick(story)
    story.expect_hook_allowed("s-1", READ_NOTES, SILENT_LINE)


def test_an_alias_is_marked_silent_only_once_its_run_has_printed_nothing_for_30_seconds(new_story):
    story = install_runner(new_story(fixture=BuildSaved))
    moved_run(story, RUN, category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=10))
    SilentAliasMarking()(story.container)
    expect_value(read_alias(story).silent_at is None, True)
    story.advance(timedelta(seconds=21))
    SilentAliasMarking()(story.container)
    expect_value(bool(read_alias(story).is_claimed), True)


def test_the_next_run_of_a_silent_alias_is_refused_until_the_alias_is_edited(new_story):
    story = silent_run(new_story)
    end_run(story, story.row(Process, 1), "")
    for hook in read_hook(story, {"build-npm": "npm run build"}):
        hook.expect_denied(RUN, REFUSAL)
        edited_alias(story)
        story.run_listeners()
        hook.expect_expanded(RUN, EDITED_LINE)


def test_an_edited_alias_whose_run_prints_clears_its_mark(new_story):
    story = silent_run(new_story)
    edited_alias(story)
    expect_value(bool(read_alias(story).fixed_at is not None and not read_alias(story).is_claimed), True)
    process = moved_run(story, RUN, category=CommandCategory.BUILD)
    story.container.get(OutputFolder).write_output(process.id, 1, "step 1\n")
    SilentAliasMarking()(story.container)
    cleared = read_alias(story)
    expect_value(bool(cleared.silent_at is None and cleared.fixed_at is None), True)


def test_an_edited_alias_whose_run_stays_silent_is_held_again(new_story):
    story = silent_run(new_story)
    edited_alias(story, "npm run build --quiet")
    moved_run(story, RUN, category=CommandCategory.BUILD)
    story.advance(timedelta(seconds=31))
    SilentAliasMarking()(story.container)
    expect_value(bool(read_alias(story).is_claimed), True)


def test_an_edit_that_leaves_the_line_alone_does_not_free_a_silent_alias(new_story):
    story = silent_run(new_story)
    story.expect_success('alias edit build-npm --about "builds the web files"', actor=story.agent)
    expect_value(bool(read_alias(story).is_claimed), True)


def test_a_silent_go_test_over_several_packages_is_told_why_and_how_to_fix_it(new_story):
    story = install_runner(new_story(fixture=BuildSaved))
    story.expect_success('alias add gotest "go test ./..." --category "test run"', actor=story.agent)
    line = "journal gotest --tail 5"
    part = PartSpec(line, "journal", False, CommandCategory.TEST_RUN, "go test ./...")
    process = story.container.get(Bus).run(StartProcess(story.agent.id, None, line, "/work/main", CommandCategory.TEST_RUN, 30, tuple([part])), story.agent, environment_id=1)
    parts_started(story, process)
    story.container.get(Bus).run(MoveProcess(process.id), story.agent, environment_id=1)
    story.advance(timedelta(seconds=30))
    cadence_tick(story)
    story.expect_hook_allowed("s-1", READ_NOTES, PACKAGES_LINE)

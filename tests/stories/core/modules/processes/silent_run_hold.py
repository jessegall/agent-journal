import os
from datetime import timedelta

from core.base.driver.command_category import CommandCategory
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.testing.story import Story
from tests.stories.core.modules.processes.hang_watch import ActiveBuild, started_tree, watch_tick
from tests.stories.core.modules.processes.support.process_samples import end_run

HANG_SECONDS = 300
OTHER_TOOL_USE = HookSamples.shell("journal task list", ShellPart("journal", CommandCategory.JOURNAL, ["task", "list"]))
READ_OUTPUT = HookSamples.shell("journal output read 1 --tail 5", ShellPart("journal", CommandCategory.JOURNAL, ["output", "read", "1", "--tail", "5"]))
STOP_OUTPUT = HookSamples.shell("journal output stop 1", ShellPart("journal", CommandCategory.JOURNAL, ["output", "stop", "1"]))
HELD = "output 1 printed nothing for 301 seconds"


def print_line(story: Story, text: str) -> None:
    folder = story.container.get(OutputFolder)
    folder.write_output(1, 1, text)
    printed_at = story.clock.timestamp().value.timestamp()
    os.utime(folder.home.folder / "processes" / "1" / "1.out", (printed_at, printed_at))


def silent_story(new_story) -> Story:
    story = new_story(fixture=ActiveBuild)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    return story


def test_a_run_silent_for_the_hang_time_holds_the_next_tool_use_and_names_what_to_read(new_story):
    story = silent_story(new_story)
    story.expect_hook_refusal("s-1", OTHER_TOOL_USE, HELD)
    story.expect_hook_refusal("s-1", OTHER_TOOL_USE, "journal output read 1 --tail 20, or stop it with journal output stop 1")


def test_the_hold_shows_the_last_lines_of_the_output(new_story):
    story = new_story(fixture=ActiveBuild)
    print_line(story, "compiling\nlinking\n")
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", OTHER_TOOL_USE, "compiling | linking")


def test_the_hold_says_the_processor_time_is_not_rising_when_it_has_not_moved(new_story):
    story = new_story(fixture=ActiveBuild)
    started_tree(story, 12.0)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", OTHER_TOOL_USE, "processor time is not rising")


def test_the_hold_says_the_processor_time_is_rising_when_it_moved_since_the_run_went_silent(new_story):
    story = new_story(fixture=ActiveBuild)
    tree = started_tree(story, 12.0)
    story.advance(timedelta(seconds=200))
    tree.used = 13.0
    watch_tick(story)
    story.advance(timedelta(seconds=HANG_SECONDS - 199))
    story.expect_hook_refusal("s-1", OTHER_TOOL_USE, "processor time is rising")


def test_reading_the_output_lets_the_next_tool_use_through_and_starts_the_silent_time_anew(new_story):
    story = silent_story(new_story)
    story.expect_hook_allowed("s-1", READ_OUTPUT)
    story.expect_success("output read 1 --tail 5", actor=story.agent)
    story.expect_hook_allowed("s-1", OTHER_TOOL_USE)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    story.expect_hook_refusal("s-1", OTHER_TOOL_USE, "printed nothing for 301 seconds")


def test_stopping_the_run_lets_the_next_tool_use_through(new_story):
    story = silent_story(new_story)
    story.expect_hook_allowed("s-1", STOP_OUTPUT)
    story.expect_success("output stop 1", actor=story.agent)
    story.expect_hook_allowed("s-1", OTHER_TOOL_USE)


def test_a_run_that_ended_holds_nothing(new_story):
    story = new_story(fixture=ActiveBuild)
    story.advance(timedelta(seconds=HANG_SECONDS + 1))
    end_run(story, story.container.get(ProcessQuery).find(1), "done\n")
    story.expect_hook_allowed("s-1", OTHER_TOOL_USE)


def test_a_run_that_prints_is_never_held(new_story):
    story = new_story(fixture=ActiveBuild)
    for number in range(3):
        story.advance(timedelta(seconds=200))
        print_line(story, f"step {number}\n")
        story.expect_hook_allowed("s-1", OTHER_TOOL_USE)

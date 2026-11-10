import pytest

from engine.driver.command_category import CommandCategory
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.testing.hook_samples import HookSamples
from core.testing.shell_part import ShellPart
from core.modules.processes.ticks.output_reading import OutputReading
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, start_process, tick
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.modules.processes.support.process_samples import moved_run
from tests.stories.support.story_checks import expect_handler

AFTER = HookSamples.shell("cat notes", ShellPart("cat", CommandCategory.READ, ["notes"])).with_fields(event="post_tool_use")
READER = 'reader add watched --commands "make*" --lines "FAILED|error"'


def watched(story) -> int:
    story.run(READER, actor=story.agent)
    process = start_process(story, "make test")
    story.run(f"output watch {process.id}", actor=story.agent)
    return process.id


def test_a_watch_tells_the_progress_only_as_it_passes_each_10_percent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add steps --commands "make*" --lines "FAILED" --progress "\\[ *([0-9]+)%\\]"', actor=story.agent)
    process_id = start_process(story, "make test").id
    story.run(f"output watch {process_id}", actor=story.agent)
    folder = story.container.get(OutputFolder)
    folder.write_output(process_id, 1, "[ 42%]\nFAILED a\n")
    tick(story)
    story.expect_hook_allowed("s-1", AFTER, f"output {process_id}: 42%")
    folder.write_output(process_id, 1, "[ 42%]\nFAILED a\n[ 47%]\n")
    tick(story)
    story.expect_absent_hook_line("s-1", AFTER, "output")
    folder.write_output(process_id, 1, "[ 42%]\nFAILED a\n[ 47%]\n[ 53%]\n")
    tick(story)
    story.expect_hook_allowed("s-1", AFTER, f"output {process_id}: 53%")


def test_a_watch_of_an_ended_process_is_refused_and_a_watch_ends_with_its_process(watched_process):
    story, process_id = watched_process
    end_run(story, start_process(story, "make other"), "done\n")
    story.expect_refusal("output watch 2", "has ended", actor=story.agent)
    story.run("output stop 1", actor=story.agent)
    story.expect_success("watch show 1", "state: ended", f"process_id: {process_id}", actor=story.agent)


def test_a_watch_is_ended_by_unwatching(watched_process):
    story, process_id = watched_process
    story.run(f"output unwatch {process_id}", actor=story.agent)
    story.expect_success("watch show 1", "state: ended", actor=story.agent)
    story.expect_refusal(f"output unwatch {process_id}", "no open watch", actor=story.agent)


def test_a_background_run_is_named_running_once_and_then_each_10_percent(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add steps --commands "make*" --lines "FAILED" --progress "\\[ *([0-9]+)%\\]"', actor=story.agent)
    process = moved_run(story, "make test")
    story.expect_hook_allowed("s-1", AFTER, f"output {process.id}: running")
    story.expect_absent_hook_line("s-1", AFTER, f"output {process.id}: running")
    story.container.get(OutputFolder).write_output(process.id, 1, "[ 42%]\nFAILED a\n")
    tick(story)
    story.expect_hook_allowed("s-1", AFTER, f"output {process.id}: 42%")


def test_an_explicit_watch_on_a_background_run_makes_no_second_watch(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "make test")
    story.run(f"output watch {process.id}", actor=story.agent)
    expect_count_lines_hook(story, "s-1", AFTER, f"output {process.id}: running", 1)


def test_a_tick_of_the_clock_keeps_a_runs_progress_current(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add steps --commands "make*" --lines "FAILED" --progress "\\[ *([0-9]+)%\\]"', actor=story.agent)
    process_id = start_process(story, "make test").id
    story.container.get(OutputFolder).write_output(process_id, 1, "[ 42%]\n")
    output_tick = OutputReading()
    expect_handler(output_tick, story, True)
    expect_progress(story, process_id, 42)
    expect_handler(output_tick, story, False)


@pytest.fixture
def watched_process(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process_id = watched(story)
    return story, process_id


def expect_progress(story, process_id, expected) -> None:
    actual = story.container.get(ProcessQuery).find(process_id).progress
    assert actual == expected, actual


def expect_count_lines_hook(story, text, item, text_2, expected) -> None:
    actual = story.hook(text, item).lines.count(text_2)
    assert actual == expected, actual

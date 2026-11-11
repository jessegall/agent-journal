from datetime import timedelta

from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.cadence_probe import cadence_tick, has_cadence_record, printed, running_run
from tests.stories.core.modules.processes.background import SavedBuildMoved, SilentVitestRun, expect_streaming_line, expect_without_hint
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

TICK = timedelta(seconds=10)


def test_a_read_command_is_not_watched(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "cat notes", category=CommandCategory.READ)
    cadence_tick(story)
    story.expect_rows(not has_cadence_record(story, process))


FIRST_OUTPUT = timedelta(seconds=30)
STOPPED_WRITING = timedelta(seconds=120)


def test_a_python_run_that_prints_nothing_for_30_seconds_is_told_it_is_not_streaming(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "python3 tools/deploy.py staging", category=CommandCategory.BUILD)
    expect_without_hint(story)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, f"output {process.id} printed nothing for 30 seconds, so its output is not streaming: it may hold its output back")


def test_a_silent_test_gets_its_hint_once_and_again_when_it_stops_printing(new_story):
    story = new_story(fixture=SilentVitestRun)
    process = running_run(story)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, "run vitest with --reporter=verbose")
    story.advance(TICK)
    cadence_tick(story)
    expect_without_hint(story)
    printed(story, process, "first line\n")
    cadence_tick(story)
    for _ in range(STOPPED_WRITING // TICK):
        story.advance(TICK)
        cadence_tick(story)
    expect_streaming_line(story, f"output {process.id} has written nothing for 120 seconds and still runs: run vitest with --reporter=verbose")


def test_a_silent_saved_command_is_told_to_fix_its_alias(new_story):
    story = new_story(fixture=SavedBuildMoved)
    story.expect_text("process show 1", "state: background", actor=story.agent)
    story.advance(FIRST_OUTPUT)
    cadence_tick(story)
    expect_streaming_line(story, "alias build-npm printed nothing for 30 seconds: make it print each step; this run stays silent, the next shows its steps")

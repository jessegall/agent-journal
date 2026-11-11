from datetime import timedelta

from engine.enums.command_category import CommandCategory
from tests.stories.core.modules.processes.support.cadence_probe import cadence_tick, has_cadence_record, printed, ring
from tests.stories.core.modules.processes.support.process_samples import moved_run, start_process
from tests.stories.core.support.coding_fixtures import BuilderStarted

TICK = timedelta(seconds=10)


def test_a_build_that_prints_twice_has_two_growth_times_and_a_silent_one_has_none(new_story):
    story = new_story(fixture=BuilderStarted)
    talking = moved_run(story, "make build", CommandCategory.BUILD)
    silent = moved_run(story, "make package", CommandCategory.BUILD)
    printed(story, talking, "compiling\n")
    cadence_tick(story)
    story.advance(TICK)
    printed(story, talking, "linking\n")
    cadence_tick(story)
    story.expect_rows(len(ring(story, talking)) == 2, ring(story, silent) == (), has_cadence_record(story, silent), detail=str(ring(story, talking)))


def test_a_read_command_is_not_watched(new_story):
    story = new_story(fixture=BuilderStarted)
    process = start_process(story, "cat notes", category=CommandCategory.READ)
    cadence_tick(story)
    story.expect_rows(not has_cadence_record(story, process))

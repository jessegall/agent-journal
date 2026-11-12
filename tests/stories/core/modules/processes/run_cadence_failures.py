from datetime import timedelta

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from tests.stories.core.modules.processes.support.cadence_probe import (cadence_lines, cut_to, damaged_record, elsewhere_run, folder_made_a_file,
                                                                       kept_lines, printed, record_text, removed_output, ring, tick_cost, ticks)
from tests.stories.core.modules.processes.support.process_samples import install_runner, moved_run
from tests.stories.core.support.coding_fixtures import BuilderStarted, UserBuilder

MAIN = "s-1"
NOT_STREAMING = "so it is not streaming"
FIFTY_RUNS = 50
MOST_STATEMENTS = 20 * FIFTY_RUNS
MOST_SECONDS = 5.0


def titled(story, process, title: str) -> None:
    story.expect_success(f'output title {process.id} "{title}"', actor=story.agent)


def test_a_missing_output_file_a_damaged_record_and_a_cut_output_give_no_notice_and_the_cut_output_still_reads(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    gone = moved_run(story, "make site", CommandCategory.BUILD)
    damaged = moved_run(story, "make docs", CommandCategory.BUILD)
    cut = moved_run(story, "make logs", CommandCategory.BUILD)
    titled(story, cut, "Building the logs")
    ticks(story, 20, gone, damaged, every=10, text="page\n")
    removed_output(story, gone)
    damaged_record(story, damaged)
    for step in range(10):
        cut_to(story, cut, f"line {step}\n", 4096)
        ticks(story, 10, damaged, every=10, text="page\n")
    story.expect_rows(cadence_lines([kept_lines(story)]) == [], record_text(story, damaged).split()[0] == str(len("page\n" * 12)), len(ring(story, cut)) == 5,
                      detail=f"{kept_lines(story)}\n{record_text(story, damaged)}")
    story.expect_text(f"output read {cut.id} --tail 1", "line 9", actor=story.agent)


def test_a_restart_of_the_server_and_a_clock_moving_back_are_not_read_as_pauses(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "pytest tests/long -q", CommandCategory.TEST_RUN)
    titled(story, process, "Running the long tests")
    ticks(story, 150, process, every=10)
    story.advance(timedelta(seconds=60))
    ticks(story, 30, process, every=10)
    restarted = len(ring(story, process))
    story.advance(timedelta(seconds=-60))
    ticks(story, 60, process, every=10)
    story.expect_text(f"process card {process.id} --json", '"state": "background"', actor=story.agent)
    story.expect_rows(restarted == 3, cadence_lines([kept_lines(story)]) == [], detail=kept_lines(story))


def test_a_run_whose_session_ended_has_no_line_written(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    process = moved_run(story, "make archive", CommandCategory.BUILD)
    story.hook(MAIN, HookSamples.sample("session_end"))
    ticks(story, 40)
    story.expect_rows(f"output {process.id} " not in kept_lines(story, actor=story.user), detail=kept_lines(story, actor=story.user))


def test_a_run_that_cannot_be_read_is_logged_by_the_tick_and_the_others_are_still_told(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    broken = moved_run(story, "make broken", CommandCategory.BUILD)
    sound = moved_run(story, "make sound", CommandCategory.BUILD)
    titled(story, sound, "Building the sound files")
    folder_made_a_file(story, broken)
    ticks(story, 30)
    story.expect_rows(f"Output {sound.id} printed nothing for 30s" in kept_lines(story), f"output {broken.id} " not in kept_lines(story), detail=kept_lines(story))
    story.expect_text("developer system-logs --level warning", f"cadence watch: output {broken.id} could not be read", actor=story.user)


def test_fifty_runs_at_once_are_judged_in_one_tick_within_its_limits(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    processes = [moved_run(story, f"make part-{number}", CommandCategory.BUILD) for number in range(FIFTY_RUNS)]
    for process in processes:
        printed(story, process, "started\n")
    story.advance(timedelta(seconds=10))
    statements, seconds = tick_cost(story)
    story.expect_rows(all(len(ring(story, process)) == 1 for process in processes), statements < MOST_STATEMENTS, seconds < MOST_SECONDS,
                      detail=f"{statements} statements in {seconds:.2f} seconds")
    story.expect_text(f"output show {processes[-1].id}", f"process_id: {processes[-1].id}", actor=story.agent)


def test_two_environments_judge_their_runs_by_their_own_thresholds(new_story):
    story = install_runner(new_story(fixture=UserBuilder))
    story.expect_success("environment make elsewhere /work/elsewhere", actor=story.user)
    other = Actor(story.new_row_id("agent start s-elsewhere claude main --environment elsewhere"), ActorType.AGENT)
    story.expect_success("setting set journal.core.processes.first-output-seconds 60 --environment elsewhere", actor=story.user)
    here = moved_run(story, "make here", CommandCategory.BUILD)
    there = elsewhere_run(story, other)
    ticks(story, 30)
    early = kept_lines(story, other.id, story.user)
    ticks(story, 30)
    story.expect_rows(f"Output {here.id} printed nothing for 30s" in kept_lines(story), f"output {there.id} " not in early,
                      f"Output {there.id} printed nothing for 60 seconds" in kept_lines(story, other.id, story.user), detail=kept_lines(story, other.id, story.user))

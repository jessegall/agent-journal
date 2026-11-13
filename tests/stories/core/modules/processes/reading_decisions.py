from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, start_process
from tests.stories.core.modules.processes.support.reading_scenarios import (FAILING_TESTS, STEPS, TOX_OUTPUT, TwoToxReaders, end_decision, end_positions, end_reason,
                                                                             ended_after_a_while, received)
from tests.stories.core.modules.processes.support.reading_decision_samples import ReadingPhase, stored_missing_reader, stored_suitable_reader
from tests.stories.core.support.coding_fixtures import BuilderStarted
from core.modules.processes.support.process_nudges import READER_FAILED


class BuildWithStartDecision(StoryFixture):
    """A make build moved to the background, and the engine kept at its start that it has no reader."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        stored_missing_reader(story, moved_run(story, "make build"), ReadingPhase.START)


def test_a_kept_decision_is_read_back_with_its_part_moment_and_reason(new_story):
    story = new_story(fixture=BuildWithStartDecision)
    story.expect_text("reading-decision show 1", "process_id: 1", "part_position: 1", "command_key: make build", "moment: start",
                      "state: missing", "action: require", "level: 2", "reason: reader missing", actor=story.agent)


def test_a_second_decision_for_the_same_moment_replaces_the_first_and_an_end_decision_is_kept_beside_it(new_story):
    story = new_story(fixture=BuildWithStartDecision)
    story.advance(timedelta(seconds=5))
    process = moved_run(story, "make build")
    stored_suitable_reader(story, process, ReadingPhase.START)
    stored_missing_reader(story, process, ReadingPhase.START)
    stored_suitable_reader(story, process, ReadingPhase.END)
    story.expect_text("reading-decision show 2", "moment: start", "state: missing", actor=story.agent)
    story.expect_text("reading-decision show 3", "moment: end", "state: suitable", actor=story.agent)
    story.expect_refusal("reading-decision show 4", "no reading-decision 4", actor=story.agent)


PYTEST_OUTPUT = "================ test session starts ================\ncollected 2 items\n\ntests/cart.py .. [100%]\n\n================ 2 passed in 0.04s ================\n"
LONG_RUN = timedelta(seconds=20)


def test_a_background_build_with_no_reader_keeps_a_missing_reader_at_its_end_and_its_agent_hears_the_same_lines(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    process = moved_run(story, "custom-build run", category=CommandCategory.BUILD)
    story.advance(LONG_RUN)
    end_run(story, process, "compiling\n" * 3 + "done\n")
    story.run_listeners()
    story.expect_text("reading-decision show 2", "moment: end", "state: missing", "reason: reader missing", actor=story.agent)
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), f"Output {process.id} ended", "No reader reads custom-build yet")
    story.expect_text(f"process card {process.id} --json", '"read_text": "Reader: none"', actor=story.agent)


def test_a_pytest_run_the_stock_reader_reads_is_suitable_and_a_read_command_needs_no_reader(new_story):
    story = new_story(fixture=BuilderStarted)
    tests_run = ended_after_a_while(story, start_process(story, "pytest tests/cart -q", category=CommandCategory.TEST_RUN), PYTEST_OUTPUT)
    read_run = start_process(story, "cat notes", category=CommandCategory.READ)
    end_run(story, read_run, "notes\n")
    story.expect_rows(end_decision(story, read_run) == ("not needed", "nothing", 1), end_decision(story, tests_run) == ("suitable", "nothing", 1))
    story.expect_text("reading-decision list --json", '"state": "suitable"', '"state": "not needed"', actor=story.agent)


def test_the_card_of_a_run_whose_reader_lacks_fields_says_the_reader_is_poor(new_story):
    story = new_story(fixture=TwoToxReaders)
    process = ended_after_a_while(story, start_process(story, "tox -e py", category=CommandCategory.BUILD), TOX_OUTPUT)
    story.expect_text(f"process card {process.id} --json", '"read_text": "Reader: poor, fields missing"', actor=story.agent)


def test_one_test_output_under_three_commands_is_read_drafted_or_suggested_once_per_line(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    read = ended_after_a_while(story, moved_run(story, "pytest tests/cart -q", CommandCategory.TEST_RUN), FAILING_TESTS)
    drafted = ended_after_a_while(story, moved_run(story, "./run-tests.sh", CommandCategory.TEST_RUN), FAILING_TESTS)
    twice = ended_after_a_while(story, moved_run(story, "./deploy.sh staging && ./deploy.sh staging", CommandCategory.BUILD), STEPS)
    lines = received(story)
    story.expect_rows(end_decision(story, read) == ("suitable", "nothing", 1), "reads pytest" not in lines and "reader pytest" not in lines,
                      end_decision(story, drafted) == ("draftable", "draft ready", 1), f"No reader reads run-tests.sh yet; a draft fits output {drafted.id}" in lines,
                      end_positions(story, twice) == [1, 2], lines.count("No reader reads deploy.sh yet") == 1, detail=lines)


def test_the_first_run_of_a_command_with_no_reader_starts_freely_with_a_suggestion_kept(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run_listeners()
    process = moved_run(story, "custom-check run", CommandCategory.BUILD)
    story.run_listeners()
    story.expect_text(f"process show {process.id}", "state: background", actor=story.agent)
    story.expect_text("reading-decision list --json", '"phase": "start"', '"state": "missing"', '"action": "nothing"', '"level": 1', actor=story.agent)


def test_readers_that_pick_no_line_keep_every_line_find_no_summary_or_no_progress_are_poor_each_for_its_reason(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    for line in ('reader add deploys --commands "./deploy*" --lines "NOTHING MATCHES THIS"', 'reader add wide --commands "./wide*" --lines "step"',
                 'reader add quiet --commands "./quiet*" --lines "step 1$" --summary "NOTHING MATCHES THIS"', 'reader add counted --commands "./counted*" --lines "step"'):
        story.run(line, actor=story.agent)
    runs = [ended_after_a_while(story, moved_run(story, line, CommandCategory.BUILD), text) for line, text in
            (("./deploy.sh staging", STEPS), ("./wide.sh", "".join(f"step {number}\n" for number in range(60))), ("./quiet.sh", STEPS), ("./counted.sh", "step 3/9\nstep 9/9\n"))]
    lines = received(story)
    reasons = [end_reason(story, process) for process in runs]
    story.expect_rows(reasons == ["lines missed", "too wide", "summary missing", "progress missing"], f"Reader deploys matched none of the 10 lines of output {runs[0].id}" in lines,
                      "Reader wide kept 60 of 60 lines" in lines, "Reader quiet found no summary" in lines, f"Output {runs[3].id} showed no progress" in lines,
                      detail=f"{reasons}\n{lines}")


def test_a_reader_whose_script_fails_is_poor_once_and_the_output_stays_readable(new_story):
    story = install_runner(new_story(fixture=BuilderStarted))
    story.run('reader add broken --commands "./broken*" --script /missing/reader.sh', actor=story.agent)
    process = ended_after_a_while(story, moved_run(story, "./broken.sh", CommandCategory.BUILD), STEPS)
    lines = received(story)
    story.expect_rows(end_reason(story, process) == "reader failed", lines.count(READER_FAILED.nudge(reader='broken', output=process.id).text) == 1, detail=lines)
    story.expect_text(f"output read {process.id} --all", "step 10", actor=story.agent)

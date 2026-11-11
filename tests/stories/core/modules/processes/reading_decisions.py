from datetime import timedelta

from engine.enums.command_category import CommandCategory
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story import Story
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.modules.processes.support.process_samples import end_run, install_runner, moved_run, start_process
from tests.stories.core.modules.processes.support.reading_scenarios import TOX_OUTPUT, TwoToxReaders, end_decision, ended_after_a_while
from tests.stories.core.modules.processes.support.reading_decision_samples import ReadingMoment, stored_missing_reader, stored_suitable_reader
from tests.stories.core.support.coding_fixtures import BuilderStarted


class BuildWithStartDecision(StoryFixture):
    """A make build moved to the background, and the engine kept at its start that it has no reader."""

    parent = BuilderStarted

    def steps(self, story: Story) -> None:
        stored_missing_reader(story, moved_run(story, "make build"), ReadingMoment.START)


def test_a_kept_decision_is_read_back_with_its_part_moment_and_reason(new_story):
    story = new_story(fixture=BuildWithStartDecision)
    story.expect_text("reading-decision show 1", "process_id: 1", "part_position: 1", "command_key: make build", "moment: start",
                      "state: missing", "action: require", "level: 2", "reason: reader missing", actor=story.agent)


def test_a_second_decision_for_the_same_moment_replaces_the_first_and_an_end_decision_is_kept_beside_it(new_story):
    story = new_story(fixture=BuildWithStartDecision)
    story.advance(timedelta(seconds=5))
    process = moved_run(story, "make build")
    stored_suitable_reader(story, process, ReadingMoment.START)
    stored_missing_reader(story, process, ReadingMoment.START)
    stored_suitable_reader(story, process, ReadingMoment.END)
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
    story.expect_hook_allowed("s-1", HookSamples.prompt("go on"), f"output {process.id} ended", "no reader reads custom-build yet")
    story.expect_text(f"process card {process.id} --json", '"reading_text": "Reader: none"', actor=story.agent)


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
    story.expect_text(f"process card {process.id} --json", '"reading_text": "Reader: poor, fields missing"', actor=story.agent)
